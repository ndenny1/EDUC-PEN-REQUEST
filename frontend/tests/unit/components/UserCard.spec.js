import { shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vue from 'vue';
import Vuex from 'vuex';
import UserCard from '../../../src/components/UserCard.vue';
import auth from '@/store/modules/auth';

describe('Home.vue', () => {
  let wrapper;
  let store;
  
  beforeEach(() => {

    Vue.use(Vuetify);
    Vue.use(Vuex);

    store = new Vuex.Store({
      modules: { auth }
    });

    wrapper = shallowMount(UserCard, {
      Vue: Vue,
      store,
      propsData: {
        userInfo: {
          displayName: 'Nathan Denny',
          _json: {
            preferred_username: 'fake@setup'
          }
        }
      }
    });
  });

  test('Test accountType()', () => {
    const res = wrapper.vm.getAccountType('testname@bceid');
    expect(res).toBe('bceid');
  });
});
