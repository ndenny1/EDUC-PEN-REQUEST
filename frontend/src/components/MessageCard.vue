<template>
  <v-card height="100%" width="100%" color="#C3F1E8" class="pa-3" v-if="status === requestStatuses.INITREV">
    <p class="mb-2"><strong>Your email has been verified and your PEN request has now been submitted for processing.</strong></p>
    <ul>
      <li>You will receive an email when your request has been processed.</li>
      <li>Requests are processed during normal business hours.</li>
      <li>In most cases you'll get a response within one business day.</li>
      <li>Your request details are shown below.</li>
      <li><strong>We recommend that you also check back here after one business day.</strong></li>
    </ul>
  </v-card>
  <v-card height="100%" width="100%" color="#C3F1E8" class="pa-3" v-else-if="status === requestStatuses.SUBSREV">
    <p class="mb-2"><strong>Your updated PEN request has now been submitted for processing.</strong></p>
    <ul>
      <li>You will receive an email when your request has been processed.</li>
      <li>Requests are processed during normal business hours.</li>
      <li>In most cases you'll get a response within one business day.</li>
      <li>Your request details are shown below.</li>
      <li><strong>We recommend that you also check back here after one business day.</strong></li>
    </ul>
  </v-card>
  <v-card height="100%" width="100%" color="#FFECA9" class="pa-3" v-else-if="status === requestStatuses.DRAFT && timedout">
    <p class="mb-2"><strong>Your email verification was not completed within the time limited. Repeat the email verification process.</strong></p>
    <ol>
      <li>Click the "Resend Verification Email" button below.</li>
      <li>Go to your email inbox for {{ request.email }} and check for an email from {{ ministry }}. Check your spam folder too.</li>
      <li>Open the email and click on the link within 24 hours to complete the verification process.</li>
    </ol>
  </v-card>
  <v-card height="100%" width="100%" color="#FFECA9" class="pa-3" v-else-if="status === requestStatuses.DRAFT && ! timedout">
    <p class="mb-2"><strong>You are almost finished! To complete your request, verify the email address you provided. Follow these steps.</strong></p>
    <p>
      <ol>
        <li>Go to your email inbox for <strong>{{ request.email }}</strong> and check for an email from {{ ministry }}. Check your spam folder too.</li>
        <li>Open the email and click on the link in the email <strong>within 24 hours</strong> of starting the email verification process.</li>
      </ol>
    </p>
    <p>If needed, click the "Resend Verification Email" button below to have the system send a new email and then follow the instructions above.</p>
    <p>The details of your request are shown below.</p>
  </v-card>
  <v-card height="100%" width="100%" color="#FFECA9" class="pa-3" v-else-if="status === requestStatuses.RETURNED">
    <p class="mb-2"><strong>Additional information is required to complete your request. Follow these steps:</strong></p>
    <p>
      <ol>
        <li>Read the comments from the PEN Administrator in the "Discussion with PEN Administrator" panel.</li>
        <li>Provide the requested information by typing text into the bottom of the discussion panel.</li>
        <li>If documents were requested, upload scanned copies of the documents using the "Upload Document" button.</li>
        <li>When finished, click the "Submit" button to send your request back. Complete steps 2 and 3 fully before you Submit.</li>
      </ol>
    </p>
    <p>No further work can be done on your request until you complete all these steps.</p>
  </v-card>
  <v-card height="100%" width="100%" color="#FFECA9" class="pa-3" v-else-if="status === requestStatuses.REJECTED">
    <p class="mb-2"><strong>Your request to get your PEN could not be completed, for the following reason:</strong></p>
    <p>
      <ul>
        <li>{{ request.failureReason }}</li>
      </ul>
    </p>
    <p>If needed, you can submit another request using the button below.</p>
  </v-card>
  <v-card height="100%" width="100%" color="#C3F1E8" class="pa-3" v-else-if="status === requestStatuses.AUTO || status === requestStatuses.MANUAL">
    <p class="mb-2"><strong>Your PEN request is complete! Your PEN is: {{student.pen}}</strong></p>
    <br/>
    <p>Below is the key information the Ministry of Education has on file for you.</p>
    <v-container justify="center">
    <v-row no-gutters class="py-0 px-2">
      <v-col cols="12" xl="4" lg="4" md="4" sm="4">
        <p class="mb-1">Legal Last Name:</p>
      </v-col>
      <v-col cols="12" xl="4" lg="5" md="5" sm="5">
        <p class="mb-1"><strong>{{ student.legalLastName }}</strong></p>
      </v-col>
    </v-row>
    <v-row no-gutters class="py-0 px-2">
      <v-col cols="12" xl="4" lg="4" md="4" sm="4">
        <p class="mb-1">Legal First Name(s):</p>
      </v-col>
      <v-col cols="12" xl="4" lg="5" md="5" sm="5">
        <p class="mb-1"><strong>{{ student.legalFirstName }}</strong></p>
      </v-col>
    </v-row>   
    <v-row no-gutters class="py-0 px-2">
      <v-col cols="12" xl="4" lg="4" md="4" sm="4">
        <p class="mb-1" color="green">Legal Middle Name(s):</p>
      </v-col>
      <v-col cols="12" xl="4" lg="5" md="5" sm="5">
        <p class="mb-1"><strong>{{ student.legalMiddleNames }}</strong></p>
      </v-col>
    </v-row>
    <v-row no-gutters class="py-0 px-2">
      <v-col cols="12" xl="4" lg="4" md="4" sm="4">
        <p class="mb-1">Date of Birth:</p>
      </v-col>
      <v-col cols="12" xl="4" lg="5" md="5" sm="5">
        <p class="mb-1"><strong>{{ student.dob ? moment(request.dob).format('YYYY-MM-DD'):'' }}</strong></p>
      </v-col>
    </v-row>
    <v-row no-gutters class="py-0 px-2">
      <v-col cols="12" xl="4" lg="4" md="4" sm="4">
        <p class="mb-3">Sex:</p>
      </v-col>
      <v-col cols="12" xl="4" lg="5" md="5" sm="5">
        <p class="mb-3"><strong>{{ student.sexCode }}</strong></p>
      </v-col>
    </v-row>
    </v-container>
    <p>You now may wish to use your PEN to:<p>
    <p>
      <ul>
        <li>
          <a :href="transcriptUrl" target="_blank">
            Get or send copies of your B.C. School Transcript
          </a>
        </li>
      </ul>
    </p>
    <p>You can log back into this site at any time to see this page with your PEN.</p>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import { PenRequestStatuses } from '@/utils/constants';

export default {
  name: 'messageCard',
  data() {
    return {
      transcriptUrl: 'https://www2.gov.bc.ca/gov/content/education-training/k-12/support/transcripts-and-certificates'
    };
  },
  computed: {
    ...mapGetters('auth', ['userInfo']),
    ...mapGetters('penRequest', ['penRequest', 'student']),
    status() {
      return this.penRequest.penRequestStatusCode;
    },
    request() {
      return this.penRequest;
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
  methods: {
    moment,
  }
};
</script>
