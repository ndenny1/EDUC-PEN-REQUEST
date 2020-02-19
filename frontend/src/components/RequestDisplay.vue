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
            <v-card height="100%" width="100%" outlined color="#00e6ac" class="pa-3" v-if="this.status === this.requestStatuses.INITREV || this.status === this.requestStatuses.SUBSREV">
                <p class="mb-2"><b>Your email has been verified and your PEN request has now been submitted for processing.</b></p>
                <ul>
                    <li>You will receive an email when your request has been processed.</li>
                    <li>Requests are processed during normal business hours.</li>
                    <li>In most cases you'll get a response within one business day.</li>
                    <li>Your request details are shown below.</li>
                    <li><b>We recommend that you also check back here after one business day, because email is sometimes delayed.</b></li>
                </ul>
            </v-card>
            <v-card height="100%" width="100%" outlined color="#e6e600" class="pa-3" v-else-if="this.status === this.requestStatuses.DRAFT && this.timedout">
                <p class="mb-2"><b>Your email verification was not completed within the time limited. Repeat the email verification process.</b></p>
                <ol>
                    <li>Click the "Resend Verification Email" button below.</li>
                    <li>Go to your email inbox for {{ this.request.email }} and check for an email from {{ this.ministry }}. Check your spam folder too.</li>
                    <li>Open the email and click on the link within 24 hours to complete the verification process.</li>
                </ol>
            </v-card>
            <v-card height="100%" width="100%" outlined color="#e6e600" class="pa-3" v-else-if="this.status === this.requestStatuses.DRAFT && ! this.timedout">
                <p class="mb-2"><b>Your email is not yet verified. Complete the email verification process.</b></p>
                <ol>
                    <li>Go to your email inbox for {{ this.request.email }} and check for an email from {{ this.ministry }}. Check your spam folder too.</li>
                    <li>Open the email and click on the link in the email within 24 hours of starting the email verification process.</li>
                </ol>
                <p>If needed click the "Resend Verification Email" button below to have the system send a new email and then follow the instructions above.</p>
            </v-card>
            <v-card height="100%" width="100%" outlined color="#e6e600" class="pa-3" v-else-if="this.status === this.requestStatuses.RETURNED">
                <p class="mb-2"><b>Additional information is required to complete your request. Follow these steps:</b></p>
                <ol>
                    <li>Read the comments from the PEN Administrator in the "Discussion with PEN Administrator" panel.</li>
                    <li>Provide the requested information by typing text into the bottom of the discussion panel.</li>
                    <li>If documents were requested, upload scanned copies of the documents using the "Upload Document" button.</li>
                    <li>When finished, click the "Submit" button to send your request back. Complete steps 2 and 3 fully before you Submit.</li>
                </ol>
                <p>No further work can be done on your request until you complete all these steps.</p>
            </v-card>
            <v-card height="100%" width="100%" outlined color="#e6e600" class="pa-3" v-else-if="this.status === this.requestStatuses.REJECTED || this.status === this.requestStatuses.UNMATCHED">
                <p class="mb-2"><b>Your request to get your PEN could not be completed, for the following reason:</b></p>
                <ul>
                    <li>{{ request.failureReason }}</li>
                </ul>
                <p>If needed, you can submit another request using the button below.</p>
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
                            <p><b>{{ this.request.initialSubmitDate ? moment(this.request.initialSubmitDate).fromNow():'' }}</b> {{ this.request.initialSubmitDate ? ', at ' + moment(this.request.initialSubmitDate).format('YYYY-MM-DD LT'):'' }}</p>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
            <v-col xl="4" lg="4" md="4" sm="4" class="pa-0 align-self-start" v-if="this.status === this.requestStatuses.REJECTED || this.status === this.requestStatuses.UNMATCHED">
              <v-card height="100%" width="100%" elevation=0>
                <v-row no-gutters justify="end" class="pb-5">
                  <v-btn color="#38598a" dark class="ml-2 text-none" @click.stop="$router.push('pen-request')">Create a new PEN Request</v-btn>
                </v-row>
              </v-card>
            </v-col>
            <v-col xl="4" lg="4" md="4" sm="4" class="pa-0 align-self-start" v-else-if="this.status === this.requestStatuses.DRAFT">
              <v-card height="100%" width="100%" elevation=0>
                <v-row no-gutters justify="end" class="pb-5">
                  <v-btn color="#38598a" dark class="ml-2 text-none" @click.stop="resendVerificationEmail">Resend Verification Email</v-btn>
                </v-row>
              </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" xl="6" lg="6" md="6" class="px-1 py-3">
                <RequestCard> </RequestCard>
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
            <v-btn color="#38598a" dark class="ml-2 text-none" to="/">Submit</v-btn>
          </v-row>
        </v-card>
    <!-- </v-col> -->
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { PenRequestStatuses } from '@/utils/constants';
import moment from 'moment';
import ApiService from '@/common/apiService';
import Chat from './Chat';
import DocumentList from './DocumentList';
import RequestCard from './RequestCard';

export default {
  name: 'requestDisplay',
  components: {
    Chat,
    DocumentList,
    RequestCard
  },
  data() {
    return {
      participants: [],
      messages: [],

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
    myself() {
      return ({name: this.userInfo.displayName, id: '1'});
    },
    ministry() {
      return 'Ministry of Education';
    },
    requestStatuses() {
      return PenRequestStatuses;
    },
    timedout() {
      return Math.floor(new Date() - new Date(this.request.statusUpdateDate)) / (1000*60*60) > 24;
    }
  },
  mounted() {
    ApiService.getCommentList(this.request.penRequestID).then(response => {
      this.participants = response.data.participants;
      this.messages = response.data.messages;
    }).catch(error => {
      console.log(error);
      this.setLoadingErrorAlert();
    });
  },
  methods: {
    moment,
    setSuccessAlert() {
      this.alertMessage = 'Your verification email has been sent successfully.';
      this.alertType = 'success';
      this.alert = true;
    },
    setErrorAlert(alertMessage) {
      this.alertMessage = alertMessage;
      this.alertType = 'error';
      this.alert = true;
    },
    setLoadingErrorAlert() {
      this.setErrorAlert('Sorry, an unexpected error seems to have occured. You can refresh the page later.');
    },
    resendVerificationEmail() {
      ApiService.resendVerificationEmail(this.request.penRequestID).then(() => {
        this.setSuccessAlert();
      }).catch(error => {
        console.log(error);
        this.setErrorAlert('Sorry, an unexpected error seems to have occured. You can click on the resend button again later.');
      });
    }
  }
};
</script>

<style scoped>
#chat-box {
  height: 90%;
  min-height: 425px;
  padding-bottom: 8px;
}

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
