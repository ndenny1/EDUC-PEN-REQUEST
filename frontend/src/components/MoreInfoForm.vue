<template>
    <v-card class="request-display">  
        <!-- <v-col class="fill-height pb-5" > -->
        <v-row v-if="alertType === 'success'">
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
            <v-card height="100%" width="100%" outlined color="#e6e600" class="pa-3" v-if="this.status === this.requestStatuses.RETURNED">
                <p class="mb-2"><b>Additional information is required to complete your request. Follow these steps:</b></p>
                <ol>
                    <li>Read the comments from the PEN Administrator in the "Discussion with PEN Administrator" panel.</li>
                    <li>Provide the requested information by typing text into the bottom of the discussion panel.</li>
                    <li>If documents were requested, upload scanned copies of the documents using the "Upload Document" button.</li>
                    <li>When finished, click the "Submit" button to send your request back. Complete steps 2 and 3 fully before you Submit.</li>
                </ol>
                <p>No further work can be done on your request until you complete all these steps.</p>
            </v-card>
        </v-row>
        <v-row class="flex-grow-0 pb-5">
            <v-card height="100%" width="100%" elevation=0>
                <v-card-title class="pb-0 px-0">PEN Request Status</v-card-title>
                <v-divider/>
            </v-card>
        </v-row>
        <v-row class="d-flex">
            <v-col xl="auto" lg="auto" md="auto" sm="auto" class="py-0 pl-0">
                <v-card height="100%" width="100%" elevation=0>
                    <v-row no-gutters>
                        <v-col xl="auto" lg="auto" md="auto" sm="auto">
                            <p class="mb-2">Status of your request:</p>
                        </v-col>
                        <v-col xl="auto" lg="auto" md="auto" sm="auto">
                            <p class="mb-2"><b>{{this.status}}</b></p>
                        </v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col xl="auto" lg="auto" md="auto" sm="auto">
                            <p class="mb-2">Status was last updated:</p>
                        </v-col>
                        <v-col xl="auto" lg="auto" md="auto" sm="auto">
                            <p class="mb-2"><b>{{ this.request.statusUpdateDate ? moment(this.request.statusUpdateDate).fromNow():'' }}</b>, at {{ this.request.statusUpdateDate ? moment(this.request.statusUpdateDate).format('YYYY-MM-DD LT'):'' }}</p>
                        </v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col xl="auto" lg="auto" md="auto" sm="auto">
                            <p>Request was first Submitted:</p>
                        </v-col>
                        <v-col xl="auto" lg="auto" md="auto" sm="auto">
                            <p><b>{{ this.request.initialSubmitDate ? moment(this.request.initialSubmitDate).fromNow():'' }}</b> {{ this.request.initialSubmitDate ? ', at' + moment(this.request.initialSubmitDate).format('YYYY-MM-DD LT'):'' }}</p>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
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
                <DocumentList></DocumentList>
            </v-col>
        </v-row>
        <v-row v-if="alertType === 'error'">
            <v-alert
                dense
                text
                dismissible
                v-model="alert"
                :type="alertType"
                width="100%"
            >
                {{ alertMessage }}
            </v-alert>
        </v-row>
        <v-card height="100%" width="100%" elevation=0>
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
import moment from 'moment';
import ApiService from '@/common/apiService';
import Chat from './Chat';
import RequestCard from './RequestCard';
import DocumentList from './DocumentList';

export default {
  name: 'moreInfoForm',
  components: {
    Chat,
    RequestCard,
    DocumentList,
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
    ...mapGetters('auth', ['isAuthenticated', 'userInfo']),
    status() {
      return this.userInfo.penRequest.penRequestStatusCode;
    },
    request() {
      return this.userInfo.penRequest;
    },
    ministry() {
      return 'Ministry of Education';
    },
    requestStatuses() {
      return PenRequestStatuses;
    },
    timedout() {
      return Math.floor(new Date() - new Date(this.request.statusUpdateDate)) / (1000*60*60) > 24;
    },
  },
  methods: {
    ...mapMutations('auth', ['setPenRequest']),
    moment,
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

.v-dialog > .v-card > .v-card__text {
  padding: 24px 24px 20px;
}
.noPadding{
    padding-top: 0px;
    margin-top: 0px;
}
.col{
  padding: 0px 10px;
}

.request-display{
  margin: 20px 0px;
  padding: 40px;
}
</style>
