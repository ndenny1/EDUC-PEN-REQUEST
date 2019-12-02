<template>


  <v-container fluid v-if="!isAuthenticated">
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

  <v-container fluid class="full-height" v-else-if="isAuthenticated && dataReady && userInfo.pen">
    <article id="pen-display-container" class="top-banner full-height">
      <v-row align="center" justify="center">
        <PenDisplay></PenDisplay>
      </v-row>
    </article>
  </v-container>

  <v-container fluid class="full-height" v-else-if="isAuthenticated && dataReady">
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
import { mapGetters } from 'vuex';
export default {
  name: 'home',
  components: {
    Login,
    Info,
    LoginCards,
    RequestForm,
    PenDisplay
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated']),
    ...mapGetters('auth', ['userInfo']),
    dataReady: function() {
      if(!(this.userInfo)){
        return false;
      } else {
        return true;
      }
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container{
  padding: 0px;
  padding-bottom: 50px;
}
.top-banner{
  background-image: url("https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80");
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
