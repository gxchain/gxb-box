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
        certified: false
    },
    getters: {
        account: state => state.account,
        certified: state => state.certified
    },
    mutations: {
        setAccount(state, payload) {
            state.account = payload.account;
        },
        setCertified(state, payload) {
            state.certified = payload.certified;
        }
    },
    actions: {
        setAccount({commit}, payload) {
            commit('setAccount', payload);
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
    if (localStorage.getItem('account_type')){
        if (!store.state.account){
            //加载配置文件
            axios.get('/api/fetch_config/' + localStorage.getItem('account_type')).then((res) => {
                if (res.data.account_name){
                    store.state.account = res.data;
                    //是否已完成认证
                    if (store.state.certified){
                        //是否已完善配置
                        if ((store.state.account.callback_url) || (store.state.account.service&&store.state.account.subscribed_data_product.length>0)){
                            localStorage.setItem('init_step', 4);
                        }else{
                            localStorage.setItem('init_step', 3);
                        }
                    }else{
                        localStorage.setItem('init_step', 2);
                    }
                }
            }).catch((err)=> {
                console.error(err);
            });
        }
    }
    if ((localStorage.getItem('init_step') != 4) && (to.path!='/init')){
        next('/init');
    }else{
        next();
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