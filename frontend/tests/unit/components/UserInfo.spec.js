import { mount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vue from 'vue';
import Vuex from 'vuex';
import UserInfo from '../../../src/components/UserInfo.vue';
import auth from '../../../src/store/modules/auth';

describe('Home.vue', () => {
  let wrapper;
  let store;
  
  
  beforeEach(() => {

    Vue.use(Vuetify);
    Vue.use(Vuex);


    store = new Vuex.Store({
      modules: {auth}
    });

    wrapper = mount(UserInfo, {
      Vue: Vue,
      store
    });
  });

  test('Test init of template', () => {
    expect(wrapper.html()).toContain('<v-container');
  });

});
