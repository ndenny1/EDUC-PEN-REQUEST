<template>
    <v-card class="request-display">  
        <v-row class="flex-grow-0 pb-5">
            <v-card height="100%" width="100%" elevation=0 color="#036" class="white--text">
                <v-card-title class="py-3 pl-5"><h1>PEN Request Status</h1></v-card-title>
            </v-card>
        </v-row>
        <v-row>
            <v-alert
                id="alert-message"
                dense
                text
                dismissible
                v-model="alert"
                :type="alertType"
                class="mb-5"
                width="100%"
            >
                {{ alertMessage }}
            </v-alert>
        </v-row>
        <v-row class="pb-5">
            <MessageCard></MessageCard>
        </v-row>
        <v-row>
            <StatusCard @success-alert="setSuccessAlert" @error-alert="setErrorAlert"></StatusCard>
        </v-row>
        <v-row v-if="this.status !== this.requestStatuses.DRAFT">
            <v-col cols="12" xl="6" lg="6" md="6" class="px-1 py-3">
                <RequestCard></RequestCard>
            </v-col>
            <v-col cols="12" xl="6" lg="6" md="6" class="px-1 py-3">
                <Chat :hideInput="this.status !== this.requestStatuses.RETURNED"></Chat>
            </v-col>
        </v-row>
        <v-row justify="center" v-else>
            <v-col cols="12" xl="8" lg="8" md="8" class="px-1 py-3">
                <RequestCard></RequestCard>
            </v-col>
        </v-row>
        <v-row v-if="this.status !== this.requestStatuses.DRAFT">
            <v-col col="12" class="px-0 py-3">
                <DocumentList :editable="this.status === this.requestStatuses.RETURNED"></DocumentList>
            </v-col>
        </v-row>
        <v-card height="100%" width="100%" elevation=0 v-if="this.status === this.requestStatuses.RETURNED">
          <v-row no-gutters justify="end" class="py-3">
            <v-btn color="#38598a" dark class="ml-2 text-none" :loading="submitting" @click.stop="submitMoreInfo">Submit</v-btn>
          </v-row>
        </v-card>
  </v-card>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { PenRequestStatuses } from '@/utils/constants';
import ApiService from '@/common/apiService';
import Chat from './Chat';
import DocumentList from './DocumentList';
import RequestCard from './RequestCard';
import MessageCard from './MessageCard';
import StatusCard from './StatusCard';

export default {
  name: 'requestDisplay',
  components: {
    Chat,
    DocumentList,
    RequestCard,
    MessageCard,
    StatusCard
  },
  data() {
    return {
      submitting: false,

      alert: false,
      alertMessage: null,
      alertType: null
    };
  },
  computed: {
    ...mapGetters('penRequest', ['penRequest']),
    status() {
      return this.penRequest.penRequestStatusCode;
    },
    request() {
      return this.penRequest;
    },
    requestStatuses() {
      return PenRequestStatuses;
    },
  },
  mounted() {
    window.scrollTo(0,0);
  },
  methods: {
    ...mapMutations('penRequest', ['setPenRequest']),
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
    submitMoreInfo() {
      this.submitting = true;
      ApiService.updatePenRequestStatus(this.request.penRequestID, PenRequestStatuses.SUBSREV).then(response => {
        if(response.data) {
          this.setPenRequest(response.data);
        }
        this.setSuccessAlert('Your PEN request has been submitted successfully.');
        window.scrollTo(0,0);
      }).catch(() => {
        this.setErrorAlert('Sorry, an unexpected error seems to have occured. You can click on the submmit button again later.');
        window.scrollTo(0,0);
      }).finally(() => {
        this.submitting = false;
      });
    },
  }
};
</script>

<style scoped>
.full-height{
  height: 100%;
}

.col{
  padding: 0 10px;
}

.request-display{
  margin: 10px 0 20px;
  padding: 20px 40px;
}

#alert-message /deep/ .v-icon {
  padding-left: 1px;
}

</style>
