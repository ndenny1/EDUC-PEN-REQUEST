import ApiService from '@/common/apiService';
import {getData, postData} from '@/store/modules/helpers';

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    getDocumentTypeCodes: () => getData(ApiService.getDocumentTypeCodes),
    getFileRequirements: () => getData(ApiService.getFileRequirements),
    uploadFile: (_context, fileData) => postData(ApiService.uploadFile, _context, fileData),
  }
};
