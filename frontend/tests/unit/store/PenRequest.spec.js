import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import ApiService from '@/common/apiService';
import penStore from '@/store/modules/penRequest';
import { cloneDeep } from 'lodash';
import MockAdapter from 'axios-mock-adapter';
import { ApiRoutes } from '@/utils/constants.js';

const mockAxios = new MockAdapter(ApiService.apiAxios);

describe('auth.js', () => {
  const spy = jest.spyOn(ApiService.apiAxios, 'get');
  let store;

  beforeEach(() => {
    ApiService.apiAxios.interceptors.response.eject(ApiService.intercept);
    const localVue = createLocalVue();
    localVue.use(Vuex);

    store = new Vuex.Store(cloneDeep(penStore));
  });
  afterEach(() => {
    spy.mockClear();
  });

  it('User should get true response on successful post', async () => {
    mockAxios.onPost(ApiRoutes.PEN_REQUEST).reply(200, {
      status: 200
    });

    var response = await store.dispatch('postRequest');
    expect(response).toBeTruthy();
  });

  it('User should get false response on failed post', async () => {
    mockAxios.onPost(ApiRoutes.PEN_REQUEST).reply(400, {
      status: 400
    });

    var response = await store.dispatch('postRequest');
    expect(response).toBeFalsy();
  });
});
