import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '@/components/Home.vue';
import User from '@/components/UserInfo.vue';
//import { AuthRoutes } from '@/utils/constants';
//import store from '@/store/index.js';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/user',
      name: 'user',
      component: User
    },
    {
      path: '*',
      name: 'notfound',
      redirect: '/'
    }
  ]
});

export default router;
