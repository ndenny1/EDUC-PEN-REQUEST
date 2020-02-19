<template>


  <v-container fluid v-if="!isAuthenticated && !isLoading">
    <!-- login article -->
    <article name="login-banner" class="top-banner">
      <v-row align="center" justify="center">
        <Login></Login>
      </v-row>
    </article>
    <article id="info-section" class="infoTab">
      <v-row align="center" justify="center">
        <Info></Info>
      </v-row>
    </article>
    <article id="info-cards" class="bottomContainer">
      <v-row align="center" justify="center">
        <LoginCards></LoginCards>
      </v-row>
    </article>
  </v-container>

  <v-container fluid class="full-height" v-else-if="isLoading">
    <article id="pen-display-container" class="top-banner full-height">
      <v-row align="center" justify="center">
        <v-progress-circular
          :size="70"
          :width="7"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </v-row>
    </article>
  </v-container>

  <v-container fluid class="full-height" v-else-if="isAuthenticated && hasPen">
    <article id="pen-display-container" class="top-banner full-height">
      <v-row align="center" justify="center">
        <PenDisplay></PenDisplay>
      </v-row>
    </article>
  </v-container>

  <v-container fluid class="full-height" v-else-if="isAuthenticated && hasPenRequest">
    <article id="request-display-container" class="top-banner full-height">
      <v-row align="center" justify="center"> 
        <MoreInfoForm v-if="requireMoreInfo"></MoreInfoForm>
        <RequestDisplay v-else></RequestDisplay>
     </v-row>
    </article>
  </v-container>

  <v-container fluid class="full-height" v-else-if="isAuthenticated && !hasPen && !hasPenRequest">
    <!-- pen request form -->
    <article id="request-form-container" class="top-banner full-height">
      <v-row align="center" justify="center">
        <RequestForm></RequestForm>
      </v-row>
    </article>
  </v-container>


  <v-container fluid class="full-height" v-else>
    <article id="request-form-container" class="top-banner full-height">
      <v-row align="center" justify="center">
        <v-skeleton-loader type="image"></v-skeleton-loader>
      </v-row>
    </article>
  </v-container>
</template>

<script>
import Login from './Login';
import Info from './Info';
import RequestForm from './RequestForm';
import LoginCards from './LoginCards';
import PenDisplay from './PenDisplay';
import RequestDisplay from './RequestDisplay';
import MoreInfoForm from './MoreInfoForm';
import { PenRequestStatuses } from '../utils/constants';
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'home',
  components: {
    Login,
    Info,
    LoginCards,
    RequestForm,
    PenDisplay,
    RequestDisplay,
    MoreInfoForm
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'userInfo', 'isLoading']),
    hasPen() {
      return !!this.userInfo && !!this.userInfo.pen;
    },
    hasPenRequest() {
      return !!this.userInfo && !!this.userInfo.penRequest;
    },
    requireMoreInfo() {
      return this.hasPenRequest && 
        this.userInfo.penRequest.penRequestStatusCode == PenRequestStatuses.RETURNED;
    }
  },
  methods: {
    ...mapActions('penRequest', ['getGenderCodes'])
  },
  watch: {
    isAuthenticated : function(val) {
      if(val) {
        this.getGenderCodes();
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container{
  padding: 0px;
  padding-bottom: 50px;
}
.top-banner{
  background-color: aliceblue;
  min-height: 500px;
  background-size: cover;
  align-items: center;
  display: flex;
}
.full-height{
  height: 100%;
}
.infoTab{
  padding: 10px 0px;
  background-color: #fafafa
}
.bottomContainer{
  padding-bottom: 30px
}
</style>
