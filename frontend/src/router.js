import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '@/components/Home.vue';
import Landing from '@/components/Landing.vue';
//import { AuthRoutes } from '@/utils/constants';
import store from '@/store/index.js';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      beforeEnter: guard,
      name: 'home',
      component: Home
    },
    {
      path: '/landing',
      name: 'landing',
      component: Landing
    },
    {
      path: '*',
      name: 'notfound',
      redirect: '/'
    }
  ]
});

function guard(_to, _from, next){
  if(store.getters['auth/isAuthenticated']){
    next();
  } else {
    next('/landing');
  }
}
// Checks authentication BEFORE rendering to show (or not) password protected locations


export default router;
