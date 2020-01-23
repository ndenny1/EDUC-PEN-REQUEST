import ApiService from '@/common/apiService';
import {getData} from '@/store/modules/helpers';

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async postRequest(_context, info){
      try {
        const response = await ApiService.postPenRequest(info);
        if(response.status !== 200){
          return false;
        }
        return true;
      } catch(e) {
        console.log('Error while accessing API - ' + e);
      }
    },
    getGenderCodes: () => getData(ApiService.getGenderCodes),
    getPenRequest: (_context, penRequestId) => getData(ApiService.getPenRequest, penRequestId),
  }
};
