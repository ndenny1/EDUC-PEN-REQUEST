import { shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import Vue from 'vue';
import UserInfo from '@/components/UserInfo.vue';
import auth from '@/store/modules/auth.js';

describe('UserCard.vue', () => {
  let wrapper;
  let store;

  beforeEach(() => {
    Vue.use(Vuetify);
    Vue.use(Vuex);

    store = new Vuex.Store({
      modules: { auth }
    });

    wrapper = shallowMount(UserInfo, {
      Vue: Vue,
      store
    });
  });

  test('expect skeleton loader if no data provided', () => {
    expect(wrapper.html()).toContain('<article');
  });
});
