<template>
  <header class="gov-header">
    <v-toolbar>
      <!-- Navbar content -->
      <a href="https://www2.gov.bc.ca">
        <img
          src="@/assets/images/bcid-logo-rev-en.svg"
          width="152"
          height="55"
          alt="B.C. Government Logo"
        >
      </a>

      <v-toolbar-title><h3 style="color:white">{{ appTitle }}</h3></v-toolbar-title>
      
      <!--
      <div>
        <v-btn text id="nav-home" color="text" :to="{ path: '/'}">View Users</v-btn>
        <v-btn text id="nav-user-form" color="text" :to="{ path: '/add_user'}">Add User</v-btn>
      </div>
      -->

      <v-spacer></v-spacer>

      <div v-if="isAuthenticated">
        <v-btn dark text tile id="nav-logout" @click="logout" to='landing'>Logout</v-btn>
      </div>
    </v-toolbar>
  </header>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data(){
    return {
      appTitle: 'PEN Request'
    };
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated'])
  },
  methods: {
    logout(){
      this.$store.commit('auth/logoutState');
    }
  }
};
</script>

<style>
.gov-header .title {
  color: #fff;
  text-decoration: none;
}
.gov-header .v-toolbar {
  background-color: rgb(0, 51, 102) !important;
  border-bottom: 2px solid rgb(252, 186, 25) !important;
}
.gov-header .v-btn,
.v-btn--active.title:before,
.v-btn.title:focus:before,
.v-btn.title:hover:before {
  color: #fff;
  background: none;
}
.secondary_color {
  background-color: var(--v-secondary-base);
}
</style>
