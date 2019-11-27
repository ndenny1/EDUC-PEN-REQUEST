import ApiService from '../../common/apiService';

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async postRequest(context, info){
      try {
        await ApiService.postPenRequest(info);
      } catch(e) {
        context.commit('addUser', e);
      }
    },
  }
};
