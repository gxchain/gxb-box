import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Routers from './router';
import Vuex from 'vuex';
import Util from './libs/util';
import App from './app.vue';
import VueTimeago from 'vue-timeago';
import 'iview/dist/styles/iview.css';

import axios from 'axios';
Vue.prototype.$http = axios;

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(iView);
Vue.use(VueTimeago, {
    name: 'timeago',
    locale: 'zh-CN',
    locales: {
        'zh-CN': require('vue-timeago/locales/zh-CN.json')
    }
});

const store = new Vuex.Store({
    state: {
        account: null,
        account_type: localStorage.getItem('__gxbBox__accountType') ? localStorage.getItem('__gxbBox__accountType') : null,
        init_step: 0,
        certified: false,
        active_nav: null,
        common_setting: null
    },
    getters: {
        account_type: state => state.account_type,
        account: state => state.account,
        init_step: state => state.init_step,
        certified: state => state.certified,
        active_nav: state => state.active_nav,
        common_setting: state => state.common_setting,
    },
    mutations: {
        setAccountType(state, payload) {
            state.account_type = payload.account_type;
        },
        setAccount(state, payload) {
            state.account = payload.account;
        },
        setInitStep(state, payload) {
            state.init_step = payload.init_step;
        },
        setCertified(state, payload) {
            state.certified = payload.certified;
        },
        setActiveNav(state, payload) {
            state.active_nav = payload.active_nav;
        },
        setCommonSetting(state, payload) {
            state.common_setting = payload.common_setting;
        }
    },
    actions: {
        setAccountType({commit}, payload) {
            commit('setAccountType', payload);
        },
        setAccount({commit}, payload) {
            commit('setAccount', payload);
        },
        setInitStep({commit}, payload) {
            commit('setInitStep', payload);
        },
        setCertified({commit}, payload) {
            commit('setCertified', payload);
        },
        setActiveNav({commit}, payload) {
            commit('setActiveNav', payload);
        },
        setCommonSetting({commit}, payload) {
            commit('setCommonSetting', payload);
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

    switch (to.path.split('/')[1]){
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
        default:
            store.state.active_nav = '2';
            break;
    }

    //初始化未完成，强制进入初始化
    if ((store.state.init_step !== 'finished') && (to.path !== '/init')){
        next('/init');
    }
    //初始化已完成，禁止进入初始化
    if ((store.state.init_step === 'finished') && (to.path === '/init')){
        next('/');
    }
    next();
});

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

//验证初始化是否完成
if (store.state.account_type) {
    //加载配置文件
    axios.get('/api/fetch_config').then((res) => {
        if (res.data[store.state.account_type] && res.data[store.state.account_type].account_name) {
            store.state.common_setting = res.data['common'];
            store.state.account = {
                account_name: res.data[store.state.account_type].account_name,
                private_key: res.data[store.state.account_type].private_key
            };
            //是否已完成认证
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
                        if (res.data && res.data.length &&  res.data.length>0){
                            //状态:pm2已启动过 - init-finished
                            store.state.init_step = 'finished';
                        }else{
                            //是否已完善配置
                            if ((store.state.account.callback_url) || (store.state.account.service && store.state.account.subscribed_data_product)) {
                                //状态:pm2未启动过 - init-step5
                                store.state.init_step = 4;
                            } else {
                                //状态:账号已认证，配置未完善 - init-step4
                                store.state.init_step = 3;
                            }
                        }
                        new Vue({
                            el: '#app',
                            router: router,
                            store: store,
                            render: h => h(App)
                        });
                    }).catch((err)=>{
                        console.error(err);
                    });
                } else {
                    store.state.init_step = 2;
                    //状态:账号未完成认证 - init-step3
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
        }else{
            store.state.init_step = 1;
            //状态:尚未创建或导入账号 - init-step2
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
    //状态:首次访问 - init-step1
    new Vue({
        el: '#app',
        router: router,
        store: store,
        render: h => h(App)
    });
}