import axios from 'axios';
import { ApiRoutes } from '@/utils/constants';
import AuthService from '@/common/authService';

// Buffer concurrent requests while refresh token is being acquired
let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
}

// Create new non-global axios instance and intercept strategy
const apiAxios = axios.create();
const intercept = apiAxios.interceptors.response.use(config => config, error => {
  const originalRequest = error.config;
  if (error.response.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        try {
          const token = failedQueue.push({ resolve, reject });
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return axios(originalRequest);
        } catch (e) {
          return e;
        }
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    return new Promise((resolve, reject) => {
      AuthService.refreshAuthToken(localStorage.getItem('jwtToken'))
        .then(response => {
          if (response.jwtFrontend) {
            localStorage.setItem('jwtToken', response.jwtFrontend);
            apiAxios.defaults.headers.common['Authorization'] = `Bearer ${response.jwtFrontend}`;
            originalRequest.headers['Authorization'] = `Bearer ${response.jwtFrontend}`;
          }

          processQueue(null, response.jwtFrontend);
          resolve(axios(originalRequest));
        })
        .catch(e => {
          processQueue(e, null);
          localStorage.removeItem('jwtToken');
          reject(e);
        })
        .finally(() => isRefreshing = false);
    });
  }

  return Promise.reject(error);
});

export default {
  apiAxios: apiAxios,
  intercept: intercept,
  processQueue,
  failedQueue,

  //Adds required headers to the Auth request
  setAuthHeader(token) {
    if (token) {
      apiAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete apiAxios.defaults.headers.common['Authorization'];
    }
  },

  async postPenRequest(userInfo){
    try{
      const response = await apiAxios.post(ApiRoutes.PEN_REQUEST, userInfo);
      return response;
    } catch(e) {
      console.log(`Failed to post to Nodejs API - ${e}`);
      throw e;
    }
  },

  async getGenderCodes() {
    try{
      const response = await apiAxios.get(ApiRoutes.GENDER_CODES);
      return response;
    } catch(e) {
      console.log(`Failed to get from Nodejs API - ${e}`);
      throw e;
    }
  },

  async getDocumentTypeCodes() {
    try{
      const response = await apiAxios.get(ApiRoutes.DOCUMENT_TYPE_CODES);
      return response;
    } catch(e) {
      console.log(`Failed to get from Nodejs getDocumentTypeCodes API - ${e}`);
      throw e;
    }
  },

  async getFileRequirements() {
    try{
      const response = await apiAxios.get(ApiRoutes.FILE_REQUIREMENTS);
      return response;
    } catch(e) {
      console.log(`Failed to get from Nodejs getFileRequirements API - ${e}`);
      throw e;
    }
  },

  async uploadFile(fileData){
    try{
      const response = await apiAxios.post(ApiRoutes.FILE_UPLOAD, fileData);
      return response;
    } catch(e) {
      console.log(`Failed to post to Nodejs uploadFile API - ${e}`);
      throw e;
    }
  },

  async getPenRequest(penRequestId) {
    try{
      const response = await apiAxios.get(ApiRoutes.PEN_REQUEST + `/${penRequestId}`);
      return response;
    } catch(e) {
      console.log(`Failed to get from Nodejs getPenRequest API - ${e}`);
      throw e;
    }
  },
};
