import Vue from 'vue';
import Vuetify, { VBtn } from 'vuetify/lib';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';

Vue.use(Vuetify, {
    components: {
        VBtn,
    },
});

export default new Vuetify({
    icons: {
        iconfont: 'mdi',
    },
});
