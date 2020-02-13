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
        if(response.status !== 200){    //todo: need to fix
          return false;
        }
        return response.data;
      } catch(e) {
        console.log('Error while accessing API - ' + e);
        return false;
      }
    },
    getGenderCodes: () => getData(ApiService.getGenderCodes),
    getPenRequest: (_context, penRequestId) => getData(ApiService.getPenRequest, penRequestId),
  }
};
