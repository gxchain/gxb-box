const routers = [
    {
        path: '/',
        meta: {
            title: ''
        },
        component: (resolve) => require(['./views/index.vue'], resolve)
    },
    {
        path: '/init',
        meta: {
            title: '初始化'
        },
        component: (resolve) => require(['./views/init.vue'], resolve)
    },
    {
        path: '*',
        redirect: '/'
    }
];
export default routers;