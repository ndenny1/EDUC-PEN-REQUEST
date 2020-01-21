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
        :error="fileInputError"
        @change="selectFile"
      ></v-file-input>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="#003366"
          class="white--text"
          id="upload_form"
          @click="uploadFile"
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
      </v-card-actions>
    </v-form>

    <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-card>
        <v-card-text class="fullPadding">
          {{ dialogMessage }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
      fileInputError: false,
      documentTypeCode: null,
      file: null,
      documentTypes: null,
      active: false,

      dialog: false,
      dialogMessage: null
      
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
    selectFile(file) {
      this.file = file;
      if(!this.file && !this.active) {
        this.fileInputError = true;
      } else {
        this.fileInputError = false;
      }
    },
    validate() {
      this.$refs.form.validate();
    },
    async uploadFile() {
      if(this.dataReady){
        let formData = new FormData();
        formData.append('documentTypeCode', this.documentTypeCode);
        formData.append('documentOwnerTypeCode', this.documentOwnerTypeCode);
        formData.append('documentOwnerId', this.documentOwnerId);
        try {
          this.active = true;
          const resStatus = await this.$store.dispatch('document/uploadFile', formData);
          if(resStatus){
            this.$refs.form.reset();
            this.dialogMessage = 'File upload success!';
            this.dialog = true;
          } else {
            this.$refs.form.reset();
            this.dialogMessage = 'File upload failure.';
            this.dialog = true;
          }
        } catch (e) {
          throw e;
        } finally {
          this.active = false;
        }
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
  margin: 20px 0px;
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
