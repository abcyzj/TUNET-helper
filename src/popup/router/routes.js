import Main from '../components/Main';
import Device from '../components/Device';
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
        path: '/device',
        component: Device,
    },
    {
        path: '/setting',
        component: Setting,
    },
];

export default routes;
