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
                <v-card height="100%" width="99%">
                    <v-toolbar flat color="#036" class="white--text">
                        <v-toolbar-title>PEN Request Data you submitted</v-toolbar-title>
                    </v-toolbar>
                    <v-row no-gutters class="pt-2 px-2">
                        <v-col cols="12" xl="5" lg="5" md="5" sm="5">
                            <p class="mb-2" color="green">Legal Last Name:</p>
                        </v-col>
                        <v-col cols="12" xl="6" lg="6" md="6" sm="6">
                            <p class="mb-2"><b>{{ this.request.legalLastName }}</b></p>
                        </v-col>
                    </v-row>
                    <v-row no-gutters class="pt-2 px-2">
                        <v-col cols="12" xl="5" lg="5" md="5" sm="5">
                            <p class="mb-2" color="green">Legal First Names:</p>
                        </v-col>
                        <v-col cols="12" xl="6" lg="6" md="6" sm="6">
                            <p class="mb-2"><b>{{ this.request.legalFirstName }}</b></p>
                        </v-col>
                    </v-row>   
                    <v-row no-gutters class="pt-2 px-2 pb-8">
                        <v-col cols="12" xl="5" lg="5" md="5" sm="5">
                            <p class="mb-2" color="green">Legal Middle Names:</p>
                        </v-col>
                        <v-col cols="12" xl="6" lg="6" md="6" sm="6">
                            <p class="mb-2"><b>{{ this.request.legalMiddleNames }}</b></p>
                        </v-col>
                    </v-row>
                    <v-row no-gutters class="px-2">
                        <v-col cols="12" xl="5" lg="5" md="5" sm="5">
                            <p class="mb-2">Usual Last Name:</p>
                        </v-col>
                        <v-col cols="12" xl="6" lg="6" md="6" sm="6">
                            <p class="mb-2"><b>{{ this.request.usualLastName }}</b></p>
                        </v-col>
                    </v-row>
                    <v-row no-gutters class="px-2">
                        <v-col cols="12" xl="5" lg="5" md="5" sm="5">
                            <p class="mb-2">Usual First Names:</p>
                        </v-col>
                        <v-col cols="12" xl="6" lg="6" md="6" sm="6">
                            <p class="mb-2"><b>{{ this.request.usualFirstName }}</b></p>
                        </v-col>
                    </v-row>
                    <v-row no-gutters class="px-2 pb-8">
                        <v-col cols="12" xl="5" lg="5" md="5" sm="5">
                            <p class="mb-2">Usual Middle Names:</p>
                        </v-col>
                        <v-col cols="12" xl="6" lg="6" md="6" sm="6">
                            <p class="mb-2"><b>{{ this.request.usualMiddleName }}</b></p>
                        </v-col>
                    </v-row>
                    <v-row no-gutters class="px-2">
                        <v-col cols="12" xl="5" lg="5" md="5" sm="5">
                            <p>Maiden Name:</p>
                        </v-col>
                        <v-col cols="12" xl="6" lg="6" md="6" sm="6">
                            <p><b>{{ this.request.maidenName }}</b></p>
                        </v-col>
                    </v-row>
                    <v-row no-gutters class="px-2">
                        <v-col cols="12" xl="5" lg="5" md="5" sm="5">
                            <p class="mb-2" color="green">Past Names:</p>
                        </v-col>
                        <v-col cols="12" xl="6" lg="6" md="6" sm="6">
                            <p class="mb-2"><b>{{ this.request.pastNames }}</b></p>
                        </v-col>
                    </v-row>
                    <v-row no-gutters class="px-2">
                        <v-col cols="12" xl="5" lg="5" md="5" sm="5">
                            <p class="mb-2">Date of Birth:</p>
                        </v-col>
                        <v-col cols="12" xl="6" lg="6" md="6" sm="6">
                            <p class="mb-2"><b>{{ this.request.dob ? moment(this.request.dob).format('YYYY-MM-DD'):'' }}</b></p>
                        </v-col>
                    </v-row>
                    <v-row no-gutters class="px-2">
                        <v-col cols="12" xl="5" lg="5" md="5" sm="5">
                            <p>Gender:</p>
                        </v-col>
                        <v-col cols="12" xl="6" lg="6" md="6" sm="6">
                            <p><b>{{ this.request.genderCode }}</b></p>
                        </v-col>
                    </v-row>
                    <v-row no-gutters class="px-2">
                        <v-col cols="12" xl="5" lg="5" md="5" sm="5">
                            <p class="mb-2" color="green">Current BC School:</p>
                        </v-col>
                        <v-col cols="12" xl="6" lg="6" md="6" sm="6">
                            <p class="mb-2"><b>{{ this.request.currentSchool }}</b></p>
                        </v-col>
                    </v-row>
                    <v-row no-gutters class="px-2">
                        <v-col cols="12" xl="5" lg="5" md="5" sm="5">
                            <p class="mb-2">Last BC School:</p>
                        </v-col>
                        <v-col cols="12" xl="6" lg="6" md="6" sm="6">
                            <p class="mb-2"><b>{{ this.request.lastBCSchool }}</b></p>
                        </v-col>
                    </v-row>
                    <v-row no-gutters class="px-2">
                        <v-col cols="12" xl="5" lg="5" md="5" sm="5">
                            <p>School Student #:</p>
                        </v-col>
                        <v-col cols="12" xl="6" lg="6" md="6" sm="6">
                            <p><b>{{ this.request.lastBCSchoolStudentNumber }}</b></p>
                        </v-col>
                    </v-row>
                    <v-row no-gutters class="px-2">
                        <v-col cols="12" xl="5" lg="5" md="5" sm="5">
                            <p class="mb-2">Email:</p>
                        </v-col>
                        <v-col cols="12" xl="6" lg="6" md="6" sm="6">
                            <p class="mb-2"><b>{{ this.request.email }}</b></p>
                        </v-col>
                    </v-row>
                    <v-row no-gutters class="pb-2 px-2">
                        <v-col cols="12" xl="5" lg="5" md="5" sm="5">
                            <p class="mb-0">ID Type:</p>
                        </v-col>
                        <v-col cols="12" xl="6" lg="6" md="6" sm="6">
                            <p class="mb-0"><b>{{ this.request.dataSourceCode }}</b></p>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
            <v-col cols="12" xl="6" lg="6" md="6" class="px-1 py-3">
                <v-card height="100%" width="100%">
                    <v-toolbar flat color="#036" class="white--text">
                        <v-toolbar-title>Discussion with PEN Administrator</v-toolbar-title>
                    </v-toolbar>
                    <Chat id="chat-box" :myself="myself" :participants="participants" :messages="messages" :penRequestID="request.penRequestID" :hideInput="this.status !== this.requestStatuses.RETURNED"></Chat>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col col="12" class="px-0 py-3">
                <v-card>
                    <v-toolbar flat color="#036" class="white--text">
                        <v-toolbar-title>Documents</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn color="#38598a" dark class="ml-2 text-none" @click.stop="this.dialog = true" v-if="this.status === this.requestStatuses.RETURNED">
                            Upload Document
                        </v-btn>
                    </v-toolbar>
                    <v-data-table
                        :headers="headers"
                        :items="documents"
                        sort-by="['createDate']"
                        :items-per-page="15"
                        :loading="loadingDocuments"
                        class="fill-height">
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>
        <v-card height="100%" width="100%" elevation=0 v-if="this.status === this.requestStatuses.RETURNED">
          <v-row no-gutters justify="end" class="py-3">
            <v-btn color="#38598a" dark class="ml-2 text-none" to="/">Submit</v-btn>
          </v-row>
        </v-card>

        <v-dialog
          v-model="dialog"
          cols="12" xl="6" lg="6" md="6"
        >
          <DocumentUpload 
            :penRequestID="this.request.penRequestID"
            @close:form="() => dialog = false"
            @uploaded="addDocument">
          </DocumentUpload>
        </v-dialog>
    <!-- </v-col> -->
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { PenRequestStatuses } from '@/utils/constants';
import moment from 'moment';
import ApiService from '@/common/apiService';
import { humanFileSize } from '@/utils/file';
import Chat from './Chat';
import DocumentUpload from './DocumentUpload';

export default {
  name: 'requestDisplay',
  components: {
    Chat,
    DocumentUpload
  },
  data() {
    return {
      dialog: false,
      headers: [
        { text: 'Type', value: 'documentTypeCode',  },
        { text: 'File Name', value: 'fileName' },
        { text: 'Upload Date/time', value: 'createDate' },
        { text: 'Size', value: 'fileSize' },
      ],
      documents: [],
      loadingDocuments: true,
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
    ApiService.getDocumentList(this.request.penRequestID).then(response => {
      this.documents = response.data;
      this.documents.map(this.humanDocument);
    }).catch(error => {
      console.log(error);
      this.setLoadingErrorAlert();
    }).finally(() => this.loadingDocuments = false);

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
    humanDocument(document) {
      document.fileSize = humanFileSize(document.fileSize);
      document.createDate = new Date().toISOString().replace(/T/, ', ').replace(/\..+/, '');
      return document;
    },
    addDocument(document) {
      this.documents.push(this.humanDocument(document));
    },
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
      this.setSuccessAlert('Sorry, an unexpected error seems to have occured. You can refresh the page later.');
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
