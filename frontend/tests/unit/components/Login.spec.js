import { mount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vue from 'vue';
import Login from '../../../src/components/Login.vue';

describe('Footer.vue', () => {
  let wrapper;
  
  beforeEach(() => {
  
    Vue.use(Vuetify);
  
    wrapper = mount(Login, {
      Vue: Vue
    });
  });

  test('Login form exists', () => {
    expect(wrapper.html()).toContain('<div class="v-card__text"><div class="row align-center justify-center">');
  });
});

