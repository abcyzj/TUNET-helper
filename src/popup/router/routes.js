const routes = [
    {
        path: '*',
        redirect: '/',
    },
    {
        path: '/',
        component: () => import('../components/Main'),
    },
    {
        path: '/device',
        component: () => import('../components/Device'),
    },
    {
        path: '/setting',
        component: () => import('../components/Setting'),
    },
];

export default routes;
