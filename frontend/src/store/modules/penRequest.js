import ApiService from '@/common/apiService';
import {getData} from '@/store/modules/helpers';
import { find } from 'lodash';

export default {
  namespaced: true,
  state: {
    genders: null,
    statuses: null,
    penRequest: null,
    student: null,
  },
  getters: {
    genders: state => state.genders,
    genderInfo: state => genderCode => find(state.genders, ['genderCode', genderCode]),
    statuses: state => state.statuses,
    penRequest: state => state.penRequest,
    student: state => state.student,
  },
  mutations: {
    setGenders: (state, genders) => {
      state.genders = genders;
    },
    setStatuses: (state, statuses) => {
      state.statuses = statuses;
    },
    setPenRequest: (state, penRequest) => {
      // penRequest.penRequestStatusCode = 'REJECTED';
      // penRequest.failureReason = 'Can not find your record';

      // penRequest.penRequestStatusCode = 'DRAFT';
      // penRequest.statusUpdateDate = '2020-02-05T22:23:18.000+0000';

      // penRequest.penRequestStatusCode = 'INITREV';

      // penRequest.penRequestStatusCode = 'RETURNED';

      // penRequest.penRequestStatusCode = 'AUTO';

      // penRequest = null;

      state.penRequest = penRequest;
    },
    setStudent: (state, student) => {
      // student = {
      //   pen: '123456',
      //   legalFirstName: 'James',
      //   legalMiddleNames: 'Wayne',
      //   legalLastName: 'Duke',
      //   sexCode: 'M',
      //   sexLabel: 'Male',
      //   dob: '1998-01-01'
      // };
      state.student = student;
    },
  },
  actions: {
    async postRequest(_context, info){
      try {
        const response = await ApiService.postPenRequest(info);
        if(response.status !== 200){
          return false;
        }
        return response.data;
      } catch(e) {
        console.log('Error while accessing API - ' + e);
        return false;
      }
    },
    async getCodes({commit}) {
      const response = await ApiService.getCodes();
      commit('setGenders', response.data.genderCodes);
      commit('setStatuses', response.data.statusCodes);
    },
    getPenRequest: (_context, penRequestId) => getData(ApiService.getPenRequest, penRequestId),
  }
};
