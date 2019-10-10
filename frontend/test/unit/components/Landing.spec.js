import { mount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vue from 'vue';
import Landing from '../../../src/components/Landing.vue';

describe('Footer.vue', () => {
  let wrapper;
  
  beforeEach(() => {
  
    Vue.use(Vuetify);
  
    wrapper = mount(Landing, {
      Vue: Vue
    });
  });

  test('Login form exists', () => {
    expect(wrapper.html()).toContain('<v-container>');
  });
});