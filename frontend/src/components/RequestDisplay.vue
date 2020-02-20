<template>
    <v-card class="request-display">  
        <!-- <v-col class="fill-height pb-5" > -->
        <v-row>
            <v-alert
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
        <v-row class="flex-grow-0 pb-5">
            <v-card height="100%" width="100%" elevation=0>
                <v-card-title class="pb-0 px-0">PEN Request Status</v-card-title>
                <v-divider/>
            </v-card>
        </v-row>
        <v-row>
            <StatusCard></StatusCard>
        </v-row>
        <v-row>
            <v-col cols="12" xl="6" lg="6" md="6" class="px-1 py-3">
                <RequestCard></RequestCard>
            </v-col>
            <v-col cols="12" xl="6" lg="6" md="6" class="px-1 py-3">
                <Chat :hideInput="this.status !== this.requestStatuses.RETURNED"></Chat>
            </v-col>
        </v-row>
        <v-row>
            <v-col col="12" class="px-0 py-3">
                <DocumentList :editable="this.status === this.requestStatuses.RETURNED"></DocumentList>
            </v-col>
        </v-row>
        <v-card height="100%" width="100%" elevation=0 v-if="this.status === this.requestStatuses.RETURNED">
          <v-row no-gutters justify="end" class="py-3">
            <v-btn color="#38598a" dark class="ml-2 text-none" :loading="submitting" @click.stop="submitMoreInfo">Submit</v-btn>
          </v-row>
        </v-card>
    <!-- </v-col> -->
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
    ...mapGetters('auth', ['userInfo']),
    status() {
      return this.userInfo.penRequest.penRequestStatusCode;
    },
    request() {
      return this.userInfo.penRequest;
    },
    requestStatuses() {
      return PenRequestStatuses;
    },
  },
  methods: {
    ...mapMutations('auth', ['setPenRequest']),
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
  padding: 0px 10px;
}

.request-display{
  margin: 20px 0px;
  padding: 40px;
}
</style>
