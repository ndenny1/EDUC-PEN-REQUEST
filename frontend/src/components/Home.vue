<template>
  <v-container fluid v-if="!isAuthenticated">
    <article class="login">
      <v-row align="center" justify="center">
        <Login></Login>
      </v-row>
    </article>
    <article class="infoTab">
      <v-row align="center" justify="center">
        <Info></Info>
      </v-row>
    </article>
  </v-container>
  <v-container v-else>
    <h1>{{msg}}</h1>
  </v-container>
</template>

<script>
import Login from './Login';
import Info from './Info';
import { mapGetters } from 'vuex';
export default {
  name: 'home',
  components: {
    Login,
    Info
  },
  data() {
    return { msg: 'Welcome to the PEN Retrieval webapp!' };
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated'])
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container{
  padding: 0px;
}
.login{
  background-image: url("https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80");
  min-height: 500px;
  background-size: cover;
  align-items: center;
  display: flex;
}
.infoTab{
  padding: 10px 0px;
  background-color: rgb(252, 252, 252)
}
</style>
