import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Routers from './router';
import Vuex from 'vuex';
import Util from './libs/util';
import App from './app.vue';
import 'iview/dist/styles/iview.css';

import axios from 'axios';
Vue.prototype.$http = axios;

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(iView);

const store = new Vuex.Store({
    state: {
        account: '',
        init_step: 0,
        certified: false
    },
    getters: {
        account: state => state.account,
        init_step: state => state.init_step,
        certified: state => state.certified
    },
    mutations: {
        setAccount(state, payload) {
            state.account = payload.account;
        },
        setInitStep(state, payload) {
            state.init_step = payload.init_step;
        },
        setCertified(state, payload) {
            state.certified = payload.certified;
        }
    },
    actions: {
        setAccount({commit}, payload) {
            commit('setAccount', payload);
        },
        setInitStep({commit}, payload) {
            commit('setInitStep', payload);
        },
        setCertified({commit}, payload) {
            commit('setCertified', payload);
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
    let account_type = localStorage.getItem('account_type');
    if (account_type){
        if (!store.state.account){
            //加载配置文件
            axios.get('/api/fetch_config/' + account_type).then((res) => {
                if (res.data.account_name){
                    store.state.account = res.data;
                    //是否已完成认证
                    axios.get('/api/fetch_account/' + res.data.account_name).then((res) => {
                        let account = res.data;
                        if (account_type == 'merchant'){
                            if (account.merchant_expiration_date != '1970-01-01T00:00:00'){
                                store.state.certified = true;
                            }
                        }else{
                            if ((account.merchant_expiration_date != '1970-01-01T00:00:00')&&(account.datasource_expiration_date != '1970-01-01T00:00:00')){
                                store.state.certified = true;
                            }
                        }
                        if (store.state.certified){
                            //是否已完善配置
                            if ((store.state.account.callback_url) || (store.state.account.service&&store.state.account.subscribed_data_product)){
                                store.state.init_step = 4;
                            }else{
                                store.state.init_step = 3;

                            }
                        }else{
                            store.state.init_step = 2;
                        }
                    }).catch((err) => {
                        console.error(err);
                    });
                }
            }).catch((err)=> {
                console.error(err);
            });
        }
    }

    if ((store.state.init_step != 4) && (to.path != '/init')){
        next('/init');
    }else{
        if ((store.state.init_step == 4) && (to.path == '/init')){
            next('/');
        }else{
            next();
        }
    }
});

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App)
});