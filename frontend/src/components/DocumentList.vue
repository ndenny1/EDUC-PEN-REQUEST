<template>
  <v-card>
    <v-toolbar flat color="#036" class="white--text">
      <v-toolbar-title>Documents</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="#38598a" dark class="ml-2 text-none" @click.stop="dialog = true" v-if="editable">Upload Document</v-btn>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="documents"
      sort-by="['createDate']"
      :items-per-page="15"
      :loading="loadingDocuments"
      class="fill-height"
    >
      <template v-slot:item.fileName="{item: document}">
        <router-link :to="{ path: documentUrl(request.penRequestID, document) }" target="_blank">{{document.fileName}}</router-link> 
      </template>
      <template v-slot:item.action="{item: document}">
        <v-tooltip bottom >
          <template v-slot:activator="{ on }">
            <v-icon
              small
              v-on="on"
              @click.stop="clickDelete(document)"
              v-show="editable && document.createDate > request.statusUpdateDate && !document.deleting"
            >
              delete
            </v-icon>
            <v-progress-circular
              indeterminate
              :width="2"
              :size="15"
              class="ml-2"
              v-show="document.deleting"
            ></v-progress-circular>
          </template>
          <span>Delete</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <v-alert dense text dismissible v-model="alert" :type="alertType" width="100%">
      {{ alertMessage }}
    </v-alert>
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card> 
        <v-card-text>
          Are you sure you want to delete this document?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#003366" class="white--text" @click="deleteDocument()">Ok</v-btn>  
          <v-btn color="#003366" class="white--text" @click="deleteDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog"
      cols="12" xl="6" lg="6" md="6"
    >
      <DocumentUpload 
        :penRequestID="request.penRequestID"
        :documentTypeCodes="documentTypes"
        @close:form="() => dialog = false"
        @uploaded="addDocument">
      </DocumentUpload>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { find } from 'lodash';
import { humanFileSize } from '@/utils/file';
import { ApiRoutes } from '@/utils/constants';
import ApiService from '@/common/apiService';
import DocumentUpload from './DocumentUpload';

export default {
  name: 'documentList',
  components: {
    DocumentUpload
  },
  props: {
    editable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dialog: false,
      deleteDialog: false,
      headers: [
        { text: 'Type', value: 'documentType',  },
        { text: 'File Name', value: 'fileName' },
        { text: 'Upload Date/time', value: 'createDate' },
        { text: 'Size', value: 'fileSize' },
        { text: '', value: 'action', sortable: false },
      ],
      documents: [],
      loadingDocuments: true,
      selectedDocument: null,
      documentTypes: [],

      alert: false,
      alertMessage: null,
      alertType: null
    };
  },
  computed: {
    ...mapGetters('auth', ['userInfo']),
    request() {
      return this.userInfo.penRequest;
    },
  },
  created() {
    Promise.all([ApiService.getDocumentList(this.request.penRequestID), ApiService.getDocumentTypeCodes()]).then(responses => {
      this.documentTypes = responses[1].data;
      this.documents = responses[0].data.map(this.humanDocument);
    }).catch(() => {
      this.setErrorAlert('Sorry, an unexpected error seems to have occured. You can refresh the page later.');
    }).finally(() => this.loadingDocuments = false);
  },
  methods: {
    setSuccessAlert(alertMessage) {
      this.alertMessage = alertMessage;
      this.alertType = 'success';
      this.alert = true;
    },
    setErrorAlert(alertMessage) {
      this.alertMessage = alertMessage;
      this.alertType = 'error';
      this.alert = true;
    },
    documentUrl(penRequestID, document) {
      return `${ApiRoutes.PEN_REQUEST}/${penRequestID}/documents/${document.documentID}/download/${document.fileName}`;
    },
    humanDocument(document) {
      const typeCode = find(this.documentTypes, ['documentTypeCode', document.documentTypeCode]);
      document.documentType = typeCode && typeCode.label;
      document.fileSize = humanFileSize(document.fileSize);
      document.createDate = document.createDate.replace(/T/, ', ').replace(/\..+/, '');
      document.deleting = false;
      return document;
    },
    addDocument(document) {
      this.documents.push(this.humanDocument(document));
    },
    deleteDocument() {
      let document = this.selectedDocument;
      this.deleteDialog = false;
      document.deleting = true;
      const index = this.documents.indexOf(document);
      ApiService.deleteDocument(this.request.penRequestID, document.documentID).then(() => {
        this.documents.splice(index, 1);
        this.setSuccessAlert('Your document has been deleted successfully.');
      }).catch(() => {
        this.documents[index].deleting = false;
        this.setErrorAlert('Sorry, an unexpected error seems to have occured. You can click on the delete button again later.');
      });
    },
    clickDelete(document) {
      this.deleteDialog = true;
      this.selectedDocument = document;
    },
  }
};
</script>

<style scoped>
.v-dialog > .v-card > .v-card__text {
  padding: 24px 24px 20px;
}
</style>
