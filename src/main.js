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

// 路由配置
const RouterConfig = {
    mode: 'history',
    routes: Routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
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


const store = new Vuex.Store({
    state: {
        account: localStorage.getItem('account') ? JSON.parse(localStorage.getItem('account')) : '',
        certified: localStorage.getItem('certified') ? JSON.parse(localStorage.getItem('certified')) : false
    },
    getters: {
        account_type: state => state.account_type,
        account: state => state.account,
        certified: state => state.certified
    },
    mutations: {
        setAccountType(state, payload) {
            state.account_type = payload.account_type;
        },
        setAccount(state, payload) {
            state.account = payload.account;
        },
        setCertified(state, payload) {
            state.certified = payload.certified;
        }
    },
    actions: {
        setAccountType({commit}, payload) {
            commit('setAccountType', payload);
        },
        setAccount({commit}, payload) {
            commit('setAccount', payload);
        },
        setCertified({commit}, payload) {
            commit('setCertified', payload);
        }
    }
});


new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App)
});