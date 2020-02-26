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
          failedQueue.push({ resolve: (token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            resolve(axios(originalRequest));
          }, reject });
        } catch (e) {
          reject(e);
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

  async updatePenRequestStatus(penRequestId, status){
    try{
      const response = await apiAxios.patch(`${ApiRoutes.PEN_REQUEST}/${penRequestId}`, {penRequestStatusCode: status});
      return response;
    } catch(e) {
      console.log(`Failed to post to Nodejs API - ${e}`);
      throw e;
    }
  },

  async getCodes() {
    try{
      const response = await apiAxios.get(ApiRoutes.CODES);
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

  async uploadFile(penRequestId, fileData){
    try{
      const response = await apiAxios.post(`${ApiRoutes.PEN_REQUEST}/${penRequestId}/documents`, fileData);
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

  async getDocumentList(penRequestId) {
    try{
      const response = await apiAxios.get(ApiRoutes.PEN_REQUEST + `/${penRequestId}` + '/documents');
      return response;
    } catch(e) {
      console.log(`Failed to get from Nodejs getDocumentList API - ${e}`);
      throw e;
    }
  },

  async getDocument(penRequestId, documentId) {
    try{
      const response = await apiAxios.get(ApiRoutes.PEN_REQUEST + `/${penRequestId}` + '/documents' + `/${documentId}`);
      return response;
    } catch(e) {
      console.log(`Failed to get from Nodejs getDocument API - ${e}`);
      throw e;
    }
  },

  async deleteDocument(penRequestId, documentId) {
    try{
      const response = await apiAxios.delete(ApiRoutes.PEN_REQUEST + `/${penRequestId}` + '/documents' + `/${documentId}`);
      return response;
    } catch(e) {
      console.log(`Failed to deleteDocument from Nodejs API - ${e}`);
      throw e;
    }
  },

  async getCommentList(penRequestId) {
    try{
      const response = await apiAxios.get(ApiRoutes.PEN_REQUEST + `/${penRequestId}` + '/comments');
      return response;
    } catch(e) {
      console.log(`Failed to get from Nodejs getCommentList API - ${e}`);
      throw e;
    }
  },

  async postComment(penRequestId, message){
    try{
      const response = await apiAxios.post(ApiRoutes.PEN_REQUEST + `/${penRequestId}` + '/comments', message);
      return response;
    } catch(e) {
      console.log(`Failed to post to Nodejs postComment API - ${e}`);
      throw e;
    }
  },

  async getUserInfo() {
    try{
      const response = await apiAxios.get(ApiRoutes.USER);
      return response;
    } catch(e) {
      console.log(`Failed to get from Nodejs getUserInfo API - ${e}`);
      throw e;
    }
  },

  async resendVerificationEmail(penRequestId){
    try{
      const response = await apiAxios.post(ApiRoutes.PEN_REQUEST+ `/${penRequestId}` + '/verification-email');
      return response;
    } catch(e) {
      console.log(`Failed to post to Nodejs resendVerificationEmail API - ${e}`);
      throw e;
    }
  },
};
