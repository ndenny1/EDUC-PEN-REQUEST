import { mount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import Vue from 'vue';
import DocumentUpload from '@/components/DocumentUpload.vue';
import auth from '@/store/modules/auth.js';
import ApiService from '@/common/apiService';

describe('DocumentUpload.vue', () => {
  let wrapper;

  const localVue = createLocalVue();

  const oneMBFile = new File([new ArrayBuffer(1048576)], 'test.jpg');
  const twoMBFile = new File([new ArrayBuffer(2097152)], 'test.pdf');

  Vue.use(Vuetify);
  localVue.use(Vuex);

  addElemWithDataAppToBody();

  let vuetify = new Vuetify();
  let store = mockStore();

  jest.spyOn(ApiService, 'getFileRequirements');
  const fileRequirements = {
    maxSize: 1048579, 
    extensions: ['image/png', 'image/jpeg', 'image/bmp', '.pdf']
  };

  beforeEach(() => {
    ApiService.getFileRequirements.mockResolvedValue({data: fileRequirements});
    wrapper = mount(DocumentUpload, {
      localVue,
      vuetify,
      store,
      propsData: {
        eager: true,
      },
      sync: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('expect document upload ready', () => {
    expect(wrapper.html()).toContain('Document Type');
    expect(wrapper.html()).toContain('Select your file');
    expect(wrapper.vm.documentTypes).toContainEqual({text:'Canadian Passport', value:'CAPASSPORT'});
    expect(wrapper.vm.fileAccept).toContain('image/jpeg');
    expect(wrapper.vm.fileRules).toHaveLength(2);
  });

  test('select document type', () => {
    const select = wrapper.find({name: 'v-select'});
    // expect(select.html()).toContain('Canadian Passport');

    // let item = {text:'Canadian Birth Certificate', value:'CABIRTH'};
    // select.vm.selectItem(item);
    select.findAll('.v-list-item').at(1).trigger('click');
    expect(wrapper.vm.documentTypeCode).toBe('CADL');
  });

  test('select file', () => {    
    const input = wrapper.find({name: 'v-file-input'});
    // input.setProps({
    //   value: oneMBFile,
    // });
    //const inputElement = wrapper.find('input[type="file"]');

    input.vm.internalValue = oneMBFile;
    // await wrapper.vm.$nextTick();

    input.vm.validate();
    // expect(input.vm.hasError).toBeFalsy();
    expect(wrapper.vm.fileInputError.length).toBe(0);
    expect(wrapper.vm.file.name).toBe('test.jpg');
  });


  test('select too large file', () => {    
    const input = wrapper.find({name: 'v-file-input'});
    input.vm.internalValue = twoMBFile;

    input.vm.validate();
    expect(input.vm.hasError).toBeTruthy();
    expect(wrapper.vm.validForm).toBeFalsy();
    expect(wrapper.vm.dataReady).toBeFalsy();
  });

  test('does not select file', () => {    
    const input = wrapper.find({name: 'v-file-input'});
    input.vm.internalValue = null;

    input.vm.validate();
    expect(wrapper.vm.fileInputError).toContain('Required');
    expect(wrapper.vm.dataReady).toBeFalsy();
  });

  // test('upload file with successful API response', async () => {    
  //   const input = wrapper.find({name: 'v-file-input'});
  //   input.vm.internalValue = oneMBFile;

  //   const select = wrapper.find({name: 'v-select'});
  //   select.findAll('.v-list-item').at(1).trigger('click');

  //   wrapper.vm.validate();
  //   wrapper.vm.validForm = true;
  //   expect(wrapper.vm.dataReady).toBeTruthy();

  //   await localVue.nextTick();

  //   const button = wrapper.find('#upload_form');
  //   button.trigger('click');

  //   await localVue.nextTick();
  //   await localVue.nextTick();
  //   expect(wrapper.vm.alert).toBeTruthy();
  //   expect(wrapper.vm.alertMessage).toContain('success');
  // });

  // test('upload file with failed API response', async () => {    
  //   const input = wrapper.find({name: 'v-file-input'});
  //   input.vm.internalValue = oneMBFile;

  //   const select = wrapper.find({name: 'v-select'});
  //   select.findAll('.v-list-item').at(1).trigger('click');

  //   wrapper.vm.validate();
  //   wrapper.vm.validForm = true;
  //   expect(wrapper.vm.dataReady).toBeTruthy();

  //   await localVue.nextTick();

  //   const button = wrapper.find('#upload_form');
  //   button.trigger('click');

  //   await localVue.nextTick();
  //   await localVue.nextTick();
  //   expect(wrapper.vm.alert).toBeTruthy();
  //   expect(wrapper.vm.alertMessage).toContain('failure');
  // });

});


function mockStore() {
  const documentTypeCodes = [
    {label:'Canadian Birth Certificate', documentTypeCode:'CABIRTH', displayOrder:'3'},
    {label:'Canadian Passport', documentTypeCode:'CAPASSPORT', displayOrder:'1'},
    {label:'Canadian Driver’s License', documentTypeCode:'CADL', displayOrder:'2'},
  ];

  const actions = {
    uploadFile: jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false)
  };

  const documentGetters = {
    documentTypeCodes: jest.fn().mockReturnValue(documentTypeCodes)
  };

  const penRequestGetters = {
    penRequestID: jest.fn().mockReturnValue('penRequestID')
  };

  let store = new Vuex.Store({
    modules: { auth,
      document: {
        namespaced: true,
        actions,
        getters: documentGetters
      },
      penRequest: {
        namespaced: true,
        getters: penRequestGetters
      }
    }
  });

  return store;
}


/**
 * Adds a warapping `div data-app="true"` to the body so that we don't
 * get Vuetify complaining about missing data-app attribute for some components.
 *
 * @return undefined
 */
function addElemWithDataAppToBody() {
  const app = document.createElement('div');
  app.setAttribute('data-app', true);
  document.body.append(app);
}
