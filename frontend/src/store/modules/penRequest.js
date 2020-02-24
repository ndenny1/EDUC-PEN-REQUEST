import ApiService from '@/common/apiService';
import {getData} from '@/store/modules/helpers';
import { find } from 'lodash';

export default {
  namespaced: true,
  state: {
    genders: null,
    penRequest: null,
    isLoading: true,
  },
  getters: {
    genders: state => state.genders,
    genderInfo: state => genderCode => find(state.genders, ['genderCode', genderCode]),
    penRequest: state => state.penRequest,
    isLoading: state => state.isLoading,
  },
  mutations: {
    setGenders: (state, genders) => {
      state.genders = genders;
    },
    setPenRequest: (state, penRequest) => {
      state.penRequest = penRequest;
    },
    setLoading: (state, isLoading) => {
      state.isLoading = isLoading;
    }
  },
  actions: {
    async postRequest(_context, info){
      try {
        const response = await ApiService.postPenRequest(info);
        if(response.status !== 200){    //todo: need to fix
          return false;
        }
        return response.data;
      } catch(e) {
        console.log('Error while accessing API - ' + e);
        return false;
      }
    },
    async getGenderCodes({commit}) {
      const response = await ApiService.getGenderCodes();
      commit('setGenders', response.data);
    },
    async getLatestPenRequest({commit, dispatch}){
      const userInfoRes = await ApiService.getLatestPenRequest();
      commit('setUserInfo', userInfoRes.data);
    },
    getPenRequest: (_context, penRequestId) => getData(ApiService.getPenRequest, penRequestId),
  }
};
