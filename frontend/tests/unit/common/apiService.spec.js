//import axios from 'axios';
import ApiService from '@/common/apiService';
//import { AuthRoutes } from '@/utils/constants.js';

describe('apiService.js', () => {
  const spy = jest.spyOn(ApiService.apiAxios, 'get');

  beforeEach(() => {
    ApiService.apiAxios.interceptors.response.eject(ApiService.intercept);
  });
  afterEach(() => {
    spy.mockClear();
  });
  
  it('Set and Delete Auth header', () => {
    ApiService.setAuthHeader('randomToken');
    expect(ApiService.apiAxios.defaults.headers.common['Authorization']).toBe('Bearer randomToken');
    ApiService.setAuthHeader();
    expect(ApiService.apiAxios.defaults.headers.common['Authorization']).toBe(undefined);
  });

  it('process items in queue with error', () => {
    ApiService.failedQueue = ['itemA', 'itemB', 'itemC'];
    expect(ApiService.processQueue(Error)).rejects;
  });

  it('process items in queue with successful promise', () => {
    ApiService.failedQueue = ['itemA', 'itemB', 'itemC'];
    expect(ApiService.processQueue(null, 'token')).resolves;
  });

  it('expect intercept to be initiated', () => {
    expect(ApiService.intercept).toBeDefined();
    expect(ApiService.apiAxios).toBeDefined();
  });
});
