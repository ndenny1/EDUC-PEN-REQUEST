<template>
  <div id="status-card" class="d-flex flex-wrap">
    <v-col xl="auto" lg="auto" md="auto" sm="auto" class="py-0 pl-0">
        <v-card height="100%" width="100%" elevation=0>
            <v-row no-gutters>
                <v-col xl="auto" lg="auto" md="auto" sm="auto">
                    <p class="mb-2">Status of your request:</p>
                </v-col>
                <v-col xl="auto" lg="auto" md="auto" sm="auto">
                    <p class="mb-2"><b>{{statusLabel}}</b></p>
                </v-col>
            </v-row>
            <v-row no-gutters>
                <v-col xl="auto" lg="auto" md="auto" sm="auto">
                    <p class="mb-2">Status was last updated:</p>
                </v-col>
                <v-col xl="auto" lg="auto" md="auto" sm="auto">
                    <p class="mb-2"><b>{{ request.statusUpdateDate ? moment(request.statusUpdateDate).fromNow():'' }}</b>, at {{ request.statusUpdateDate ? moment(request.statusUpdateDate).format('YYYY-MM-DD LT'):'' }}</p>
                </v-col>
            </v-row>
            <v-row no-gutters>
                <v-col xl="auto" lg="auto" md="auto" sm="auto">
                    <p>Request was first Submitted:</p>
                </v-col>
                <v-col xl="auto" lg="auto" md="auto" sm="auto">
                    <p><b>{{ request.initialSubmitDate ? moment(request.initialSubmitDate).fromNow():'' }}</b> {{ request.initialSubmitDate ? ', at ' + moment(request.initialSubmitDate).format('YYYY-MM-DD LT'):'' }}</p>
                </v-col>
            </v-row>
        </v-card>
    </v-col>
    <v-col xl="4" lg="4" md="4" sm="4" class="pa-0 align-self-start" v-if="status === requestStatuses.REJECTED || status === requestStatuses.UNMATCHED">
      <v-card height="100%" width="100%" elevation=0>
        <v-row no-gutters justify="end" class="pb-5">
          <v-btn color="#38598a" dark class="ml-2 text-none" @click.stop="$router.push('pen-request')">Create a new PEN Request</v-btn>
        </v-row>
      </v-card>
    </v-col>
    <v-col xl="4" lg="4" md="4" sm="4" class="pa-0 align-self-start" v-else-if="status === requestStatuses.DRAFT">
      <v-card height="100%" width="100%" elevation=0>
        <v-row no-gutters justify="end" class="pb-5">
          <v-btn color="#38598a" dark class="ml-2 text-none" @click.stop="resendVerificationEmail">Resend Verification Email</v-btn>
        </v-row>
      </v-card>
    </v-col>
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
      statusCodes: [],
    };
  },
  created() {
    ApiService.getPenRequestStatusCodes().then(response => {
      this.statusCodes = response.data;
    }).catch(e => {
      console.log(e);
      this.$emit('success-alert', 'Sorry, an unexpected error seems to have occured. You can refresh the page later.');
    });
  },
  computed: {
    ...mapGetters('auth', ['userInfo']),
    status() {
      return this.userInfo.penRequest.penRequestStatusCode;
    },
    statusLabel() {
      const statusCode = find(this.statusCodes, ['penRequestStatusCode', this.status]);
      return statusCode && statusCode.label;
    },
    request() {
      return this.userInfo.penRequest;
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
      ApiService.resendVerificationEmail(this.request.penRequestID).then(() => {
        this.$emit('success-alert', 'Your verification email has been sent successfully.');
      }).catch(() => {
        this.$emit('error-alert', 'Sorry, an unexpected error seems to have occured. You can click on the resend button again later.');
      });
    },
  }
};
</script>

<style scoped>
  #status-card {
    width: 100%;
  }
</style>
