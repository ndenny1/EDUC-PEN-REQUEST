import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '@/components/Home.vue';
//import User from '@/components/UserInfo.vue';
//import store from '@/store/index.js';
import PenRequest from '@/components/RequestDisplay.vue';

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
    /*
    {
      path: '/user',
      name: 'user',
      component: User,
      meta: {
        requiresAuth: true,
        name: 'User Info'
      }
    },
    */
    {
      path: '/pen-request',
      name: 'pen-request',
      component: PenRequest
    },
    {
      path: '*',
      name: 'notfound',
      redirect: '/'
    }
  ]
});

/*router.beforeEach((to, _from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.isAuthenticated) {
      next('home');
    }
  }
  else{
    next();
  }
});*/

export default router;
