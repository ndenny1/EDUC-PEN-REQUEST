import ApiService from '@/common/apiService';
import {getData} from '@/store/modules/helpers';
import { find } from 'lodash';

export default {
  namespaced: true,
  state: {
    genders: null,
    penRequest: null,
  },
  getters: {
    genders: state => state.genders,
    genderInfo: state => genderCode => find(state.genders, ['genderCode', genderCode])
  },
  mutations: {
    setGenders: (state, genders) => {
      state.genders = genders;
    },
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
    getPenRequest: (_context, penRequestId) => getData(ApiService.getPenRequest, penRequestId),
  }
};
