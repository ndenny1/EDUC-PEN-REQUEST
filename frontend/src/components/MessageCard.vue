<template>
  <v-card height="100%" width="100%" outlined color="#00e6ac" class="pa-3" v-if="status === requestStatuses.INITREV || status === requestStatuses.SUBSREV">
    <p class="mb-2"><b>Your email has been verified and your PEN request has now been submitted for processing.</b></p>
    <ul>
      <li>You will receive an email when your request has been processed.</li>
      <li>Requests are processed during normal business hours.</li>
      <li>In most cases you'll get a response within one business day.</li>
      <li>Your request details are shown below.</li>
      <li><b>We recommend that you also check back here after one business day, because email is sometimes delayed.</b></li>
    </ul>
  </v-card>
  <v-card height="100%" width="100%" outlined color="#e6e600" class="pa-3" v-else-if="status === requestStatuses.DRAFT && timedout">
    <p class="mb-2"><b>Your email verification was not completed within the time limited. Repeat the email verification process.</b></p>
    <ol>
      <li>Click the "Resend Verification Email" button below.</li>
      <li>Go to your email inbox for {{ request.email }} and check for an email from {{ ministry }}. Check your spam folder too.</li>
      <li>Open the email and click on the link within 24 hours to complete the verification process.</li>
    </ol>
  </v-card>
  <v-card height="100%" width="100%" outlined color="#e6e600" class="pa-3" v-else-if="status === requestStatuses.DRAFT && ! timedout">
    <p class="mb-2"><b>Your email is not yet verified. Complete the email verification process.</b></p>
    <ol>
      <li>Go to your email inbox for {{ request.email }} and check for an email from {{ ministry }}. Check your spam folder too.</li>
      <li>Open the email and click on the link in the email within 24 hours of starting the email verification process.</li>
    </ol>
    <p>If needed click the "Resend Verification Email" button below to have the system send a new email and then follow the instructions above.</p>
  </v-card>
  <v-card height="100%" width="100%" outlined color="#e6e600" class="pa-3" v-else-if="status === requestStatuses.RETURNED">
    <p class="mb-2"><b>Additional information is required to complete your request. Follow these steps:</b></p>
    <ol>
      <li>Read the comments from the PEN Administrator in the "Discussion with PEN Administrator" panel.</li>
      <li>Provide the requested information by typing text into the bottom of the discussion panel.</li>
      <li>If documents were requested, upload scanned copies of the documents using the "Upload Document" button.</li>
      <li>When finished, click the "Submit" button to send your request back. Complete steps 2 and 3 fully before you Submit.</li>
    </ol>
    <p>No further work can be done on your request until you complete all these steps.</p>
  </v-card>
  <v-card height="100%" width="100%" outlined color="#e6e600" class="pa-3" v-else-if="status === requestStatuses.REJECTED || status === requestStatuses.UNMATCHED">
    <p class="mb-2"><b>Your request to get your PEN could not be completed, for the following reason:</b></p>
    <ul>
      <li>{{ request.failureReason }}</li>
    </ul>
    <p>If needed, you can submit another request using the button below.</p>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { PenRequestStatuses } from '@/utils/constants';

export default {
  name: 'messageCard',
  computed: {
    ...mapGetters('auth', ['userInfo']),
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
    }
  }
};
</script>
