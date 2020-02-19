<template>
  <v-container fluid class="full-height">
    <article id="verification-container" class="background top-banner full-height">
      <v-row align="center" justify="center" style="width: 1vw;margin-right: 0;margin-left: 0;margin-bottom: 5rem;">
        <v-col   xs="8" sm="8" md="8" lg="8" xl="8">
        <v-card class="">
          <v-card-title class="gov-header">
            <h4 id="verification_text">Email Verification</h4>
          </v-card-title>
          <v-card-text id="verification_descriptor">
            <v-card height="100%" width="100%" outlined color="#00e6ac" class="pa-3" v-if="this.status === this.verificationResults.OK">
                <p class="mb-2"><strong>Your email has been verified and your PEN request has now been submitted for processing.</strong></p>
                <ul>
                    <li>You will receive an email when your request has been processed.</li>
                    <li>Requests are processed during normal business hours.</li>
                    <li>In most cases you'll get a response within one business day.</li>
                    <li>Your request details are shown below.</li>
                    <li><strong>We recommend that you also check back here after one business day, because email is sometimes delayed.</strong></li>
                </ul>
            </v-card>
            <v-card height="100%" width="100%" outlined color="#e6e600" class="pa-3" v-else-if="this.status === this.verificationResults.EXPIRED">
                <p class="mb-2"><strong>Your email verification was not completed within the time limited. Repeat the email verification process.</strong></p>
                <ol>
                    <li>Log in and click the "Resend Verification Email" button.</li>
                    <li>Go to your email inbox and check for an email from {{ this.ministry }}. Check your spam folder too.</li>
                    <li>Open the email and click on the link within 24 hours to complete the verification process.</li>
                </ol>
            </v-card>
            <v-card height="100%" width="100%" outlined color="#e6e600" class="pa-3" v-else-if="this.status === this.verificationResults.TOKEN_ERROR">
                <p class="mb-2"><strong>Your email verification could not be completed, for the following reason:</strong></p>
                <ul>
                    <li>The verification link was invalid.</li>
                </ul>
                <br/>
                <p>If needed, you can paste the entire verification link into your web browser's address filed.</p>
            </v-card>
            <v-card height="100%" width="100%" outlined color="#e6e600" class="pa-3" v-else>
                <p class="mb-2"><strong>Sorry, your email verification could not be completed, for the following reason:</strong></p>
                <ul>
                    <li>An unexpected error seems to have occured.</li>
                </ul>
                <br/>
                <p>You can click on the verification link again later. Or you can contact us if the problem persists.</p>
            </v-card>
          </v-card-text>
          <v-card-actions v-if="this.status === this.verificationResults.OK || this.status === this.verificationResults.EXPIRED">
            <v-row align="center" justify="center">
                <v-btn id="login-button" @click="clearStorage" :href="authRoutes.LOGIN" class="ma-2" dark color='#003366'>Log In <v-icon>$sign_in</v-icon></v-btn>
            </v-row>
          </v-card-actions>

        </v-card>
      </v-col>
      </v-row>
    </article>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { VerificationResults, AuthRoutes } from '@/utils/constants';

export default {
  name: 'verification',
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated']),
    status() {
      return this.$route.params.status;
    },
    verificationResults() {
      return VerificationResults;
    },
    authRoutes() {
      return AuthRoutes;
    },
    ministry() {
      return 'Ministry of Education';
    },
  },
  methods: {
    ...mapMutations('auth', ['setJwtToken']),
    clearStorage() {
      this.setJwtToken();
    }
  }
};
</script>

<style scoped>
.container{
  padding: 0 0 50px;
}

.full-height{
  height: 100%;
}

.background{
  background-color: aliceblue;
  min-height: 500px;
  background-size: cover;
  display: flex;
  height: 100%;
  width: 100%;
}



</style>
