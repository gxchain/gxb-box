import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Routers from './router';
import Vuex from 'vuex';
import Util from './libs/util';
import App from './app.vue';
import axios from 'axios';
import VueWebsocket from 'vue-websocket';
import VueTimeago from 'vue-timeago';
import 'iview/dist/styles/iview.css';

Vue.prototype.$http = axios;
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(iView);
Vue.use(VueWebsocket, '/', {reconnection: true});
Vue.use(VueTimeago, {
    name: 'timeago',
    locale: 'zh-CN',
    locales: {
        'zh-CN': require('vue-timeago/locales/zh-CN.json')
    }
});

const store = new Vuex.Store({
    state: {
        env_type: '',
        account: null,
        account_type: null,
        init_step: 0,
        certified: false,
        active_nav: null,
        config: null
    },
    getters: {
        env_type: state => state.env_type,
        account_type: state => state.account_type,
        account: state => state.account,
        init_step: state => state.init_step,
        certified: state => state.certified,
        active_nav: state => state.active_nav,
        config: state => state.config
    },
    mutations: {
        setEnvType (state, payload) {
            state.env_type = payload.env_type;
        },
        setAccountType (state, payload) {
            state.account_type = payload.account_type;
        },
        setAccount (state, payload) {
            state.account = payload.account;
        },
        setInitStep (state, payload) {
            state.init_step = payload.init_step;
        },
        setCertified (state, payload) {
            state.certified = payload.certified;
        },
        setActiveNav (state, payload) {
            state.active_nav = payload.active_nav;
        },
        setConfig (state, payload) {
            state.config = payload.config;
        },
        setReload (state) {
            state.env_type = '';
            state.account_type = null;
            state.account = null;
            state.init_step = 0;
            state.certified = false;
            state.active_nav = null;
            state.config = null;
        }
    },
    actions: {
        setEnvType ({commit}, payload) {
            commit('setEnvType', payload);
        },
        setAccountType ({commit}, payload) {
            commit('setAccountType', payload);
        },
        setAccount ({commit}, payload) {
            commit('setAccount', payload);
        },
        setInitStep ({commit}, payload) {
            commit('setInitStep', payload);
        },
        setCertified ({commit}, payload) {
            commit('setCertified', payload);
        },
        setActiveNav ({commit}, payload) {
            commit('setActiveNav', payload);
        },
        setConfig ({commit}, payload) {
            commit('setConfig', payload);
        },
        setReload ({commit}) {
            commit('setReload');
        }
    }
});

// 路由配置
const RouterConfig = {
    mode: 'history',
    routes: Routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);

    switch (to.path.split('/')[1]) {
        case 'init':
            store.state.active_nav = '1';
            break;
        case 'console':
            store.state.active_nav = '2';
            break;
        case 'market':
            store.state.active_nav = '3';
            break;
        case 'setting':
            store.state.active_nav = '4';
            break;
        case '404':
            store.state.active_nav = null;
            break;
        default:
            store.state.active_nav = '2';
            break;
    }

    // 初始化未完成，强制进入初始化
    if ((store.state.init_step !== 'finished') && (to.path !== '/init')) {
        next('/init');
    }
    // 初始化已完成，禁止进入初始化
    if ((store.state.init_step === 'finished') && (to.path === '/init')) {
        next('/');
    }
    next();
});

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

if (localStorage.getItem('__gxbBox__env')) {
    store.state.env_type = localStorage.getItem('__gxbBox__env');
    // 验证初始化是否完成 - 加载配置文件
    axios.get('/api/fetch_config?env=' + store.state.env_type).then((res) => {
        store.state.config = res.data;
        // 是否选择账户类型
        if (res.data['common'] && res.data['common'].account_type) {
            store.state.account_type = res.data['common'].account_type;
            if (res.data[store.state.account_type] && res.data[store.state.account_type].account_name) {
                store.state.account = {
                    account_name: res.data[store.state.account_type].account_name,
                    private_key: res.data[store.state.account_type].private_key
                };
                // 是否已完成认证
                axios.get('/api/fetch_account/' + res.data[store.state.account_type].account_name).then((res) => {
                    let account = res.data;
                    if (store.state.account_type === 'merchant') {
                        if (account.merchant_expiration_date !== '1970-01-01T00:00:00') {
                            store.state.certified = true;
                        }
                    } else {
                        if ((account.merchant_expiration_date !== '1970-01-01T00:00:00') && (account.datasource_expiration_date !== '1970-01-01T00:00:00')) {
                            store.state.certified = true;
                        }
                    }
                    if (store.state.certified) {
                        axios.get('/api/fetch_box').then((res) => {
                            if (res.data && res.data.length && res.data.length > 0) {
                                // 状态:pm2已启动过 - init-finished
                                store.state.init_step = 'finished';
                            } else {
                                // 是否已完善配置
                                if ((store.state.config.merchant && store.state.config.merchant.callback_url) || (store.state.config.datasource && store.state.config.datasource.service && store.state.config.datasource.subscribed_data_product)) {
                                    // 状态:pm2未启动过 - init-step5
                                    store.state.init_step = 5;
                                } else {
                                    // 状态:账号已认证，配置未完善 - init-step4
                                    store.state.init_step = 4;
                                }
                            }
                            new Vue({
                                el: '#app',
                                router: router,
                                store: store,
                                render: h => h(App)
                            });
                        }).catch((err) => {
                            console.error(err);
                        });
                    } else {
                        store.state.init_step = 3;
                        // 状态:账号未完成认证 - init-step3
                        new Vue({
                            el: '#app',
                            router: router,
                            store: store,
                            render: h => h(App)
                        });
                    }
                }).catch((err) => {
                    console.error(err);
                });
            } else {
                store.state.init_step = 2;
                // 状态:尚未创建或导入账号 - init-step2
                new Vue({
                    el: '#app',
                    router: router,
                    store: store,
                    render: h => h(App)
                });
            }
        } else {
            store.state.init_step = 1;
            // 状态:首次访问 - init-step1
            new Vue({
                el: '#app',
                router: router,
                store: store,
                render: h => h(App)
            });
        }
    }).catch((err) => {
        console.error(err);
    });
} else {
    store.state.init_step = 0;
    // 状态:尚未选择环境 - init-step0
    new Vue({
        el: '#app',
        router: router,
        store: store,
        render: h => h(App)
    });
}
