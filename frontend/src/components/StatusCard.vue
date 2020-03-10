<template>
  <div id="status-card" class="d-flex flex-wrap justify-space-between px-1">
    <div class="py-0 pl-0">
        <v-card height="100%" width="100%" elevation=0>
            <v-row no-gutters>
                <v-col xl="auto" lg="auto" md="auto" sm="auto">
                    <p class="mb-2">Status of your request:</p>
                </v-col>
                <v-col xl="auto" lg="auto" md="auto" sm="auto">
                    <p class="ml-2 mb-2"><strong>{{statusLabel}}</strong></p>
                </v-col>
            </v-row>
            <v-row no-gutters>
                <v-col xl="auto" lg="auto" md="auto" sm="auto">
                    <p class="mb-2">Status was last updated:</p>
                </v-col>
                <v-col xl="auto" lg="auto" md="auto" sm="auto">
                    <p class="ml-2 mb-2"><strong>{{ request.statusUpdateDate ? moment(request.statusUpdateDate).fromNow():'' }}</strong>, at {{ request.statusUpdateDate ? moment(request.statusUpdateDate).format('YYYY-MM-DD LT'):'' }}</p>
                </v-col>
            </v-row>
            <v-row no-gutters>
                <v-col xl="auto" lg="auto" md="auto" sm="auto">
                    <p>Request was first Submitted:</p>
                </v-col>
                <v-col xl="auto" lg="auto" md="auto" sm="auto">
                    <p class="ml-2 mb-2"><strong>{{ request.initialSubmitDate ? moment(request.initialSubmitDate).fromNow():'' }}</strong> {{ request.initialSubmitDate ? ', at ' + moment(request.initialSubmitDate).format('YYYY-MM-DD LT'):'' }}</p>
                </v-col>
            </v-row>
        </v-card>
    </div>
    <div class="pa-0 align-self-start" v-if="status === requestStatuses.REJECTED">
      <v-card height="100%" width="100%" elevation=0>
        <v-row no-gutters justify="end" class="pb-5">
          <v-btn color="#38598a" dark class="ml-2 text-none" @click.stop="$router.push('pen-request')">Create a new PEN Request</v-btn>
        </v-row>
      </v-card>
    </div>
    <div class="pa-0 align-self-start" v-else-if="status === requestStatuses.DRAFT">
      <v-card height="100%" width="100%" elevation=0>
        <v-row no-gutters justify="end" class="pb-5">
          <v-btn color="#38598a" dark class="ml-2 text-none" @click.stop="resendVerificationEmail" :loading="sending">Resend Verification Email</v-btn>
        </v-row>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { find } from 'lodash';
import moment from 'moment';
import { PenRequestStatuses } from '@/utils/constants';
import ApiService from '@/common/apiService';

export default {
  name: 'messageCard',
  data() {
    return {
      sending: false,
    };
  },
  computed: {
    ...mapGetters('penRequest', ['penRequest', 'statuses']),
    status() {
      return this.penRequest.penRequestStatusCode;
    },
    statusLabel() {
      const statusCode = find(this.statuses, ['penRequestStatusCode', this.status]);
      return statusCode && statusCode.label;
    },
    request() {
      return this.penRequest;
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
    resendVerificationEmail() {
      this.sending = true;
      ApiService.resendVerificationEmail(this.request.penRequestID).then(() => {
        this.$emit('success-alert', 'Your verification email has been sent successfully.');
      }).catch(() => {
        this.$emit('error-alert', 'Sorry, an unexpected error seems to have occurred. You can click on the resend button again later.');
      }).finally(() => 
        this.sending = false
      );
    },
  }
};
</script>

<style scoped>
  #status-card {
    width: 100%;
  }
</style>
