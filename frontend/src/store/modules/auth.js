import ApiService from '@/common/apiService';
import AuthService from '@/common/authService';
// import router from '@/router';
// import { AuthRoutes } from '@/utils/constants';
import HttpStatus from 'http-status-codes';

function isFollowUpVisit({jwtToken}) {
  return !!jwtToken;
}

function isExpiredToken(jwtToken) {
  const now = Date.now().valueOf() / 1000;
  const jwtPayload = jwtToken.split('.')[1];
  const payload = JSON.parse(window.atob(jwtPayload));
  return payload.exp <= now;
}

async function refreshToken({getters, commit, dispatch}) {
  try {
    if (isExpiredToken(getters.jwtToken)) {
      dispatch('logout');
      return;
    }

    const response = await AuthService.refreshAuthToken(getters.jwtToken);
    if (response.jwtFrontend) {
      commit('setJwtToken', response.jwtFrontend);
      ApiService.setAuthHeader(response.jwtFrontend);
    } else {
      commit('setError', true);
      dispatch('logout');
    }
  } catch (e) {
    commit('setError', true);
    dispatch('logout');
  }
}

async function getInitialToken({commit}) {
  try {
    const response = await AuthService.getAuthToken();
    
    if (response.jwtFrontend) {
      commit('setJwtToken', response.jwtFrontend);
      ApiService.setAuthHeader(response.jwtFrontend);
    } else {
      commit('setError', true);
    }
  } catch(e) {
    if(! e.response || e.response.status != HttpStatus.UNAUTHORIZED){
      commit('setError', true);
    }
  }
}

export default {
  namespaced: true,
  state: {
    acronyms: [],
    isAuthenticated: false,
    userInfo: false,
    error: false,
    isLoading: true,
  },
  getters: {
    acronyms: state => state.acronyms,
    isAuthenticated: state => state.isAuthenticated,
    jwtToken: () => localStorage.getItem('jwtToken'),
    userInfo: state => state.userInfo,
    error: state => state.error,
    isLoading: state => state.isLoading
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
        // userInf.penRequest.penRequestStatusCode = 'REJECTED';
        // userInf.penRequest.failureReason = 'Can not find your record';

        // userInf.penRequest.penRequestStatusCode = 'DRAFT';
        // userInf.penRequest.statusUpdateDate = '2020-02-05T22:23:18.000+0000';

        // userInf.penRequest.penRequestStatusCode = 'INITREV';

        // userInf.penRequest.penRequestStatusCode = 'RETURNED';

        //userInf.pen = '1234567890';

        //userInf.penRequest = null;

        state.userInfo = userInf;
      } else {
        state.userInfo = null;
      }
    },
    setPenRequest: (state, penRequest) => {
      state.userInfo.penRequest = penRequest;
    },

    //sets the token required for refresing expired json web tokens
    logoutState: (state) => {
      localStorage.removeItem('jwtToken');
      state.userInfo = false;
      state.isAuthenticated = false;
    },

    setError: (state, error) => {
      state.error = error;
    },

    setLoading: (state, isLoading) => {
      state.isLoading = isLoading;
    }
  },
  actions: {
    logout(context) {
      context.commit('logoutState');
      // router.push(AuthRoutes.LOGOUT);
    },
    async getUserInfo({getters, commit, dispatch}){
      try{
        if(getters.isAuthenticated) {
          commit('setError', false);
          const userInfoRes = await ApiService.getUserInfo();
          commit('setUserInfo', userInfoRes.data);
        }
      } catch(e) {
        commit('setError', true);
        dispatch('logout');
      }
    },

    //retrieves the json web token from local storage. If not in local storage, retrieves it from API
    async getJwtToken(context) {
      context.commit('setError', false);
      if (isFollowUpVisit(context.getters)) {
        await refreshToken(context);
      } else {  //inital login and redirect
        await getInitialToken(context);
      }
    },
  }
};
