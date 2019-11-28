import ApiService from '../../common/apiService';

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async postRequest(context, info){
      try {
        const response = await ApiService.postPenRequest(info);
        console.log(response);
      } catch(e) {
        console.log('Error while accessing API - ' + e);
      }
    },
  }
};
