import Tinymce from '@/components/tinymce/index.vue';
import '@/icons';
import router from '@/router';
import axios from 'axios';
import Vue from 'vue';
import App from './App.vue';
import './ui';

Vue.component('tinymce', Tinymce)

Vue.config.productionTip = false
Vue.prototype.$axios = axios
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
