const routers = [
    {
        path: '/init',
        meta: {
            title: '使用引导'
        },
        component: (resolve) => require(['./views/Init.vue'], resolve)
    },
    {
        path: '/console',
        meta: {
            title: '控制台'
        },
        component: (resolve) => require(['./views/Console.vue'], resolve)
    },
    {
        path: '/market',
        meta: {
            title: '数据市场'
        },
        component: (resolve) => require(['./views/Market.vue'], resolve)
    },
    {
        path: '/setting',
        meta: {
            title: '系统设置'
        },
        component: (resolve) => require(['./views/Setting.vue'], resolve)
    },
    {
        path: '/',
        meta: {
            title: ''
        },
        component: (resolve) => require(['./views/Console.vue'], resolve)
    },
    {
        path: '*',
        redirect: '/'
    }
];
export default routers;