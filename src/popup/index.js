import Vue from 'vue';
import vuetify from './plugins/vuetify';
import App from './App';

window.browser = require('webextension-polyfill');
Vue.prototype.$browser = window.browser;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    render: h => h(App),
    vuetify,
});
