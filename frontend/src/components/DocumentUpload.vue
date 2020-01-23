<template>
  <v-card class="document-upload">

    <v-card-title><h3>Document Upload</h3></v-card-title>

    <v-form
      ref="form"
      v-model="validForm"
    >
      <v-select 
        color="#003366" 
        v-model="documentTypeCode" 
        required 
        :rules="requiredRules" 
        outlined 
        attach
        :eager="eager"
        :items="documentTypes" 
        label="Document Type">
      </v-select>
      <v-file-input
        color="#003366"
        :rules="fileRules"
        :accept="fileAccept"
        placeholder="Select your file"
        label="File"
        :error-messages="fileInputError"
        @change="selectFile"
      ></v-file-input>
      <v-alert
        dense
        text
        dismissible
        v-model="alert"
        :type="alertType"
      >
         {{ alertMessage }}
      </v-alert>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="#003366"
          class="white--text"
          id="upload_form"
          @click="submitRequest"
          :disabled="!dataReady"
        >
          <div v-if="active">
            <v-progress-circular
              indeterminate
              :size="30"
            ></v-progress-circular>
          </div>
          <div v-else>
            Upload
          </div>
        </v-btn>
        <v-btn
          color="#003366"
          class="white--text"
          @click="closeForm"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-form>

  </v-card>
</template>

<script>
//import { mapGetters } from 'vuex';
import { humanFileSize } from '@/utils/file';

export default {
  props: {
    documentOwnerTypeCode: {
      type: String,
      required: true
    },
    documentOwnerId: {
      type: String,
      required: true
    },
    eager: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      fileRules: [ ],
      fileAccept: '',
      requiredRules: [v => !!v || 'Required'],
      validForm: true,
      fileInputError: [],
      documentTypeCode: null,
      file: null,
      documentTypes: [],
      active: false,

      alert: false,
      alertMessage: null,
      alertType: null
      
    };
  },
  mounted() {
    Promise.all([this.getDocumentTypeCodes(), this.getFileRules()]);
  },
  computed: {
    dataReady () {
      return this.validForm && this.file && !this.active;
    }
  },
  methods: {
    closeForm() {
      this.resetForm();
      this.$emit('close:form');
    },
    resetForm() {
      this.$refs.form.reset();
      this.fileInputError = [];
      this.alert = false;
      this.active = false;
    },
    setSuccessAlert() {
      this.alertMessage = 'File upload success!';
      this.alertType = 'success';
      this.alert = true;
    },
    setErrorAlert() {
      this.alertMessage = 'File upload failure.';
      this.alertType = 'error';
      this.alert = true;
    },
    selectFile(file) {
      this.file = file;
      if(!this.file && !this.active) {
        this.fileInputError = 'Required';
      } else {
        this.fileInputError = [];
      }
    },
    validate() {
      this.$refs.form.validate();
    },
    submitRequest() {
      if(this.dataReady){
        try {
          this.active = true;
          const reader = new FileReader(); 
          reader.onload = this.uploadFile;
          reader.onabort = this.handleFileReadErr;
          reader.onerror = this.handleFileReadErr;
          reader.readAsBinaryString(this.file);
        } catch (e) {
          this.handleFileReadErr();
          throw e;
        }
      }
    },
    handleFileReadErr() {
      this.active = false;
      this.setErrorAlert();
    },
    async uploadFile(env) {
      let document = {
        documentTypeCode: this.documentTypeCode,
        fileName: this.file.name,
        fileExtension: this.file.type,
        fileSize: this.file.size,
        documentData: btoa(env.target.result),
        documentOwners: [{
          documentOwnerTypeCode: this.documentOwnerTypeCode,
          documentOwnerID: this.documentOwnerId
        }]
      };

      try {
        const resStatus = await this.$store.dispatch('document/uploadFile', document);
        if(resStatus){
          this.resetForm();
          this.setSuccessAlert();
        } else {
          this.handleFileReadErr();
        }
      } catch (e) {
        this.handleFileReadErr();
        throw e;
      }
    },
    async getDocumentTypeCodes() {
      const documentTypeCodes = await this.$store.dispatch('document/getDocumentTypeCodes');
      this.documentTypes = documentTypeCodes.map(code => ({text: code.label, value: code.documentTypeCode}));
    },
    async getFileRules() {
      const fileRequirements = await this.$store.dispatch('document/getFileRequirements');
      const maxSize = fileRequirements.maxSize;
      this.fileRules = [
        value => !value || value.size < maxSize || `File size should not be larger than ${humanFileSize(maxSize)}!`,
      ];
      this.fileAccept = fileRequirements.extensions.join();
    },
  },
};
</script>

<style scoped>
.document-upload{
  /* margin: 20px 0px; */
  padding: 20px;
}

.v-dialog > .v-card > .v-card__text {
  padding: 24px 24px 20px;
}

p{
  padding-top: 10px
}
ul{
  width: 100%
}
</style>
