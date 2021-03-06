import Vue from 'vue';
import Vuex from 'vuex';
import auth from '@/store/modules/auth.js';
import penRequest from '@/store/modules/penRequest.js';
import document from '@/store/modules/document.js';
import comment from '@/store/modules/comment.js';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { auth, penRequest, document, comment }
});
