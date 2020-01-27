import ApiService from '@/common/apiService';
import AuthService from '@/common/authService';
import router from '@/router';
import { AuthRoutes } from '@/utils/constants';

export default {
  namespaced: true,
  state: {
    acronyms: [],
    isAuthenticated: localStorage.getItem('jwtToken') !== null,
    userInfo: false,
  },
  getters: {
    acronyms: state => state.acronyms,
    isAuthenticated: state => state.isAuthenticated,
    jwtToken: () => localStorage.getItem('jwtToken'),
    userInfo: state => state.userInfo,
  },
  mutations: {
    //sets Json web token and determines whether user is authenticated
    setJwtToken: (state, token = null) => {
      if (token) {
        state.isAuthenticated = true;
        localStorage.setItem('jwtToken', token);
      } else {
        state.isAuthenticated = false;
        localStorage.removeItem('jwtToken');
      }
    },
    setUserInfo: (state, userInf) => {
      if(userInf){
        state.userInfo = userInf;
      } else {
        state.userInfo = null;
      }
    },

    //sets the token required for refresing expired json web tokens
    logoutState: (state) => {
      localStorage.removeItem('jwtToken');
      state.userInfo = false;
      state.isAuthenticated = false;
    }
  },
  actions: {
    logout(context) {
      context.commit('logoutState');
      router.push(AuthRoutes.LOGOUT);
    },
    async getUserInfo(context){
      try{
        if(process.env.NODE_ENV === 'development'){
          context.commit('setUserInfo', {
            displayName: 'Nathan Denny',
            firstName: 'Nathan',
            lastName: 'Denny',
            email: 'fake-email@not.real',
            accountType: 'BCEID',
            pen: null
          });
        } else {
          if(context.getters.isAuthenticated) {
            var token = await AuthService.getAuthToken();
            var tokenJson = token._json;
            context.commit('setUserInfo', tokenJson);
          }
        }
      } catch(e) {
        context.dispatch('logout');
      }
    },

    //retrieves the json web token from local storage. If not in local storage, retrieves it from API
    async getJwtToken(context) {
      if (context.getters.isAuthenticated && !!context.getters.jwtToken) { //follow up visit
        if(process.env.NODE_ENV === 'development'){
          context.commit('setJwtToken', 'testToken');
        } else{
          const now = Date.now().valueOf() / 1000;
          const jwtPayload = context.getters.jwtToken.split('.')[1];
          const payload = JSON.parse(window.atob(jwtPayload));
          try {
            if (payload.exp > now) {  //token not expired
              const response = await AuthService.refreshAuthToken(context.getters.jwtToken);
              if (!response.error && response.jwtFrontend) {
                context.commit('setJwtToken', response.jwtFrontend);
                ApiService.setAuthHeader(response.jwtFrontend);
              } else {
                context.dispatch('logout');
              }
            } else {
              context.dispatch('logout');
            }
          } catch (e) {
            context.dispatch('logout');
          }
        }
      } else {  // first login and redirect
        if(process.env.NODE_ENV === 'development'){
          context.commit('setJwtToken', 'testToken');
        } else {
          try {
            const response = await AuthService.getAuthToken();
            if (response.jwtFrontend) {
              context.commit('setJwtToken', response.jwtFrontend);
              ApiService.setAuthHeader(response.jwtFrontend);
            }
          } catch(e) {
            // expected exception
          }
        }
      }
    },
  }
};
