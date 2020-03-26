<template>
  <v-container class="blue-back" fluid>
      <v-row align="center" justify="center">
        <v-col xs="4" sm="4" md="4" lg="4" xl="4">
        <v-card class="error-card">
          <v-card-title class="gov-header">
            <h4 id="error_text">Error</h4>
          </v-card-title>
          <v-card-text id="error_message">
            Uh-oh, something went wrong! Try contacting support at <a href="mailto:John.Cox@gov.bc.ca?subject=GetMyPEN Support">John.Cox@gov.bc.ca</a>
          </v-card-text>
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header>
                Error Details
              </v-expansion-panel-header>
              <v-expansion-panel-content class="detail-text">
                <v-icon v-if="errorMessage.includes('404')">$search</v-icon>
                <v-icon v-if="errorMessage.includes('500')">$error</v-icon>
                <v-icon v-if="errorMessage.includes('401')">$lock</v-icon>
                &nbsp;&nbsp;
                {{ errorMessage.split('_').join(' ') }}
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
      </v-card>
        </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import {AuthRoutes} from '../utils/constants';
export default {
  data() {
    return {
      errorMessage: this.$route.query.message
    };
  },
  methods: {
    ...mapActions('auth', ['loginErrorRedirect'])
  },
  async created(){
    if(this.errorMessage === 'Unable_to_authenticate'){
      this.loginErrorRedirect();
    }
  }
};
</script>

<style scoped>
  .v-icon{
    padding-left: 10px;
  }
  .error-card{
    margin-top: 5%;
    min-width: 30%;
  }
  .gov-header{
    color: #003366;
  }
  .v-btn{
    text-transform: none
  }
  .blue-back{
    background-color: aliceblue;
    height: 100%;
  }
  .detail-text{
    color: rgba(0, 0, 0, 0.54);
    font-size: 0.875rem;
  }
</style>
