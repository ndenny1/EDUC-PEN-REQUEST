import AuthService from '@/common/authService';

export default{
  namespaced: true,
  state: {
    userInfo: null
  },
  getters: {
    userInfo: state => state.userInfo
  },
  mutations: {
    setUserInfo: (state, userInf = null) => {
      if(userInf){
        state.userInfo = userInf;
      } else {
        state.userInfo = null;
      }
    }
  },
  actions: {
    async getUserInfo(context){
      try{
        const response = AuthService.getAuthToken();
        context.commit('setUserInfo', response);
      } catch(e) {
        throw e;
      }
    }
  }
};
