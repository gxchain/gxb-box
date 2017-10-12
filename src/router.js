const routers = [
    {
        path: '/',
        meta: {
            title: ''
        },
        component: (resolve) => require(['./views/Market.vue'], resolve)
    },
    {
        path: '/init',
        meta: {
            title: '使用引导'
        },
        component: (resolve) => require(['./views/Init.vue'], resolve)
    },
    {
        path: '*',
        redirect: '/'
    }
];
export default routers;