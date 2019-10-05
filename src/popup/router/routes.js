import Main from '../components/Main';
import Setting from '../components/Setting';

const routes = [
    {
        path: '*',
        redirect: '/',
    },
    {
        path: '/',
        component: Main,
    },
    {
        path: '/setting',
        component: Setting,
    },
];

export default routes;
