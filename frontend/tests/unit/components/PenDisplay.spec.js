import { shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import Vue from 'vue';
import PenDisplay from '@/components/PenDisplay.vue';
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

    wrapper = shallowMount(PenDisplay, {
      Vue: Vue,
      store
    });
  });

  test('expect skeleton loader if no data provided', () => {
    expect(wrapper.html()).toContain('<v-card');
  });

  test('Copy to clipboard', () => {
    wrapper.vm.copyClipboard();
  });
});
