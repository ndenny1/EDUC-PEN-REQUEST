<template>
  <v-container v-if="!isAuthenticated">
    <v-row align="center" justify="center">
      <Login></Login>
    </v-row>
  </v-container>
  <v-container v-else>
    <h1>{{msg}}</h1>
  </v-container>
</template>

<script>
import Login from './Login';
import { mapGetters } from 'vuex';
export default {
  name: 'home',
  components: {
    Login
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
</style>
