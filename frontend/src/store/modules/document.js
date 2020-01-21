import ApiService from '@/common/apiService';
import {getCodes, postData} from '@/store/modules/helpers';

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    getDocumentTypeCodes: () => getCodes(ApiService.getDocumentTypeCodes),
    getFileRequirements: () => getCodes(ApiService.getFileRequirements),
    uploadFile: (_context, fileData) => postData(ApiService.uploadFile, _context, fileData),
  }
};
