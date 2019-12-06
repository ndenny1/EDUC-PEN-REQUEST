import { shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import Vue from 'vue';
import RequestForm from '@/components/RequestForm.vue';
import auth from '@/store/modules/auth.js';


describe('UserCard.vue', () => {
  let wrapper;
  let store;

  beforeEach(() => {
    Vue.use(Vuetify);
    Vue.use(Vuex);

    var actions = {
      postRequest: jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false)
    };

    store = new Vuex.Store({
      modules: { auth,
        penRequest: {
          actions: actions,
        }
      }
    });

    wrapper = shallowMount(RequestForm, {
      Vue: Vue,
      store
    });
  });

  test('expect v-card', () => {
    expect(wrapper.html()).toContain('<v-card');
  });

  test('submit form with positive API response', () => {
    const mockValidate = jest.fn();
    wrapper.vm.validate = mockValidate;
    wrapper.setData({
      userPost: {
        digitalID: 21,
        legalLastName: 'Testerson',
        legalFirstName: 'Test',
        legalMiddleNames: null,
        usualLastName: null,
        usualFirstName: null,
        dataSourceCode: null,
        usualMiddleName: null,
        maidenName: null,
        pastNames: null,
        dob: '2019-09-08',
        genderCode: 'Male',
        email: 'fake@email.com',
        lastBCSchool: null,
        lastBCSchoolStudentNumber: null,
        currentSchool: null
      }
    });
    wrapper.vm.submitRequestForm();
  });

  test('submit form with failed API response', () => {
    const mockValidate = jest.fn();
    wrapper.vm.validate = mockValidate;
    wrapper.setData({
      userPost: {
        digitalID: 21,
        legalLastName: 'Testerson',
        legalFirstName: 'Test',
        legalMiddleNames: null,
        usualLastName: null,
        usualFirstName: null,
        dataSourceCode: 'BCEID',
        usualMiddleName: null,
        maidenName: null,
        pastNames: null,
        dob: '2019-09-08',
        genderCode: 'Female',
        email: 'fake@email.com',
        lastBCSchool: null,
        lastBCSchoolStudentNumber: null,
        currentSchool: null
      }
    });
    wrapper.vm.submitRequestForm();
  });

  test('ensure computed values are accurate',  () => {
    expect(wrapper.vm.dataReady).toBeTruthy();
  });
});
