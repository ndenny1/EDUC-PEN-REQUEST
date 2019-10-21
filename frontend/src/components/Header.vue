<template>
  <header class="gov-header">
    <v-toolbar class="toolbar_header">
      <!-- Navbar content -->
      <a href="https://www2.gov.bc.ca">
        <img
          src="@/assets/images/bc-gov-logo.svg"
          width="155"
          class="logo"
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
        <v-btn dark text tile id="nav-logout" @click='clearStorage' :href="authRoutes.LOGOUT">Logout</v-btn>
      </div>
    </v-toolbar>
  </header>
</template>

<script>
import { mapGetters } from 'vuex';
import { AuthRoutes } from '@/utils/constants';
export default {
  data(){
    return {
      appTitle: 'PEN Retrieval',
      authRoutes: AuthRoutes
    };
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated'])
  },
  methods: {
    clearStorage() {
      this.$store.commit('auth/setJwtToken');
      this.$store.commit('auth/setRefreshToken');
    }
  }
};
</script>

<style>
.v-toolbar__content{
  padding: 4px 10px 4px 65px;
}
.logo{
  padding-right: 15px;
}
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
