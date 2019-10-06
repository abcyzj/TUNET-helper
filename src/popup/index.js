import Vue from 'vue';
import browser from 'webextension-polyfill';
import vuetify from './plugins/vuetify';
import Helper from '../lib/helper';
import Storage from '../lib/storage';
import router from './router';
import App from './App';

window.browser = browser;
Vue.prototype.$browser = window.browser;
Vue.prototype.$helper = new Helper();
Vue.prototype.$storage = new Storage();

/* eslint-disable no-new */
new Vue({
    el: '#app',
    render: h => h(App),
    vuetify,
    router,
});
