<template>
  <v-menu
    v-model="menu"
    bottom
    right
    transition="scale-transition"
    origin="top left"
  >
    <template v-slot:activator="{ on }">
      <v-chip
        class="ma-1"
        close
        close-icon="fa-chevron-down"
        color="indigo darken-3"
        label
        outlined
        v-on="on"
        @click:close="menu = true"
      >
        {{document.fileName}}
      </v-chip>
    </template>

    <v-card width="380px" class="pa-1 pa-sm-2">
      <v-list>
        <v-list-item class="px-1 pa-sm-2">
          <v-list-item-avatar>
            <v-icon>fa-id-card</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{documentType}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item class="px-1 pa-sm-2">
          <v-list-item-avatar>
            <v-icon>fa-file</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              <router-link :to="{ path: documentUrl }" target="_blank">{{document.fileName}}</router-link>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item class="px-1 pa-sm-2">
          <v-list-item-avatar>
            <v-icon>fa-hdd</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{fileSize}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item class="px-1 pa-sm-2">
          <v-list-item-avatar>
            <v-icon>fa-clock</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{humanCreateDate}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-alert dense text dismissible v-model="alert" :type="alertType" class="mx-3 my-1">
        {{ alertMessage }}
      </v-alert>

      <v-card-actions>
        <v-spacer></v-spacer>
          <v-btn color="#003366" @click.stop="deleteDocument()" class="white--text" :loading="deleting" v-if="!disabled">Delete</v-btn>
          <v-btn color="#003366" @click="menu = false" class="white--text">Cancel</v-btn>
        </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import { humanFileSize } from '@/utils/file';
import { mapGetters, mapActions } from 'vuex';
import { ApiRoutes } from '@/utils/constants';
import { find } from 'lodash';

export default {
  props: {
    document: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      deleting: false,
      menu: false,

      alert: false,
      alertMessage: null,
      alertType: null
    };
  },
  computed: {
    ...mapGetters('document', ['documentTypeCodes']),
    ...mapGetters('penRequest', ['penRequestID']),
    documentType() {
      const typeCode = find(this.documentTypeCodes, ['documentTypeCode', this.document.documentTypeCode]);
      return typeCode && typeCode.label;
    },
    fileSize() {
      return humanFileSize(this.document.fileSize);
    },
    humanCreateDate() {
      return this.document.createDate.replace(/T/, ', ').replace(/\..+/, '');
    },
    documentUrl() {
      return `${ApiRoutes.PEN_REQUEST}/${this.penRequestID}/documents/${this.document.documentID}/download/${this.document.fileName}`;
    },
  },
  methods: {
    ...mapActions('document', ['deleteFile']),
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
    deleteDocument() {
      this.deleting = true;
      this.deleteFile({ 
        penRequestID: this.penRequestID, 
        documentID: this.document.documentID
      }).then(() => {
        this.setSuccessAlert('Your document has been deleted successfully.');
      }).catch(() => {
        this.setErrorAlert('Sorry, an unexpected error seems to have occured. You can click on the delete button again later.');
      }).finally(() => {
        this.deleting = false;
      });
    },
  },
};
</script>

<style scoped>

@media screen and (max-width: 320px) {
  .v-list-item /deep/ .v-list-item__title {
    font-size: 0.85rem;
  }

  .v-avatar {
    margin-right: 0 !important;
  }

  .v-icon {
    padding-left: 0 !important;
    font-size: 1.2rem;
  }
}

@media screen and (min-width: 321px) and (max-width: 410px) {
  .v-list-item /deep/ .v-list-item__title {
    font-size: 0.9rem;
  }

  .v-avatar {
    margin-right: 4px !important;
  }

  .v-icon {
    padding-left: 4px !important;
  }
}

</style>
