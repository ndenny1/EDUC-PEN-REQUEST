import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import vuetify from './plugins/vuetify';
import router from './router';

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  components: { App },
  vuetify,
  router: router,
  template: '<App/>'
});
