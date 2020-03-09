import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '@/components/Home.vue';
import Logout from './components/Logout';
import SessionExpired from './components/SessionExpired';
import RequestPage from '@/components/RequestPage.vue';
import Verification from '@/components/Verification.vue';
import ErrorPage from '@/components/ErrorPage.vue';

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
      path: '/pen-request',
      name: 'pen-request',
      component: RequestPage
    },
    {
      path: '/verification/:status',
      name: 'verification',
      component: Verification
    },
    {
      path: '/error',
      name: 'error',
      component: ErrorPage
    },
    {
      path: '/logout',
      name: 'logout',
      component: Logout
    },
    {
      path: '/session-expired',
      name: 'session-expired',
      component: SessionExpired
    },
    {
      path: '*',
      name: 'notfound',
      redirect: '/'
    }
  ]
});

export default router;
