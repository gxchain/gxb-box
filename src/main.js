import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Routers from './router';
import Vuex from 'vuex';
import Util from './libs/util';
import App from './app.vue';
import 'iview/dist/styles/iview.css';

import VueI18n from 'vue-i18n';
import Locales from './locale';

import axios from 'axios';
Vue.prototype.$http = axios;

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueI18n);
Vue.use(iView);

// 自动设置语言
const navLang = navigator.language;
const localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false;
const lang = window.localStorage.getItem('language') || localLang || 'zh-CN';

// 多语言配置
const messages = Locales;
const i18n = new VueI18n({
    locale: lang,
    messages
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

    if ((!localStorage.getItem('account')) && (to.path!='/init')){
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


new Vue({
    el: '#app',
    i18n,
    router: router,
    store: store,
    render: h => h(App)
});