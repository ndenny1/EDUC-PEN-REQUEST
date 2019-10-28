<template>
  <header class="gov-header">
    <v-toolbar class="toolbar_header">
      <!-- Navbar content -->
      <a href="/">
        <img
          src="@/assets/images/bc-gov-logo.svg"
          width="155"
          class="logo"
          alt="B.C. Government Logo"
        >
      </a>
      <a href="/">
        <v-toolbar-title><h3 style="color:white">{{ appTitle }}</h3></v-toolbar-title>
      </a>
      <!--
      <div>
        <v-btn text id="nav-home" color="text" :to="{ path: '/'}">View Users</v-btn>
        <v-btn text id="nav-user-form" color="text" :to="{ path: '/add_user'}">Add User</v-btn>
      </div>
      -->

      <v-spacer></v-spacer>

      <div v-if="isAuthenticated && dataReady">
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-chip v-on="on" pill color="#003366" dark>
              <v-avatar left color="info">
                {{ userInfo.displayName[0] }}
              </v-avatar>
              {{ userInfo.displayName }}
              <!--<v-icon v-if="on">$downArrow</v-icon>
              <v-icon v-else>$upArrow</v-icon>-->
            </v-chip>
          </template>
          <v-list dark color="#003366">
            <v-list-item to='/user'><v-list-title>User Info</v-list-title></v-list-item>
            <v-list-item @click='clearStorage' :to='authRoutes.LOGOUT'><v-list-title>Logout</v-list-title></v-list-item>
          </v-list>
        </v-menu>
        <!--<v-btn id="logout-button" dark text tile @click='clearStorage' :href="authRoutes.LOGOUT">Logout</v-btn>-->
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
      appTitle: process.env.VUE_APP_TITLE,
      authRoutes: AuthRoutes,
      dataReady: true
    };
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated']),
    ...mapGetters('auth', ['userInfo'])
  },
  methods: {
    clearStorage() {
      this.$store.commit('auth/setJwtToken');
      this.$store.commit('auth/setRefreshToken');
    }
  },
  async mounted() {
    if(!(this.userInfo)){
      this.dataReady = false;
      await this.$store.dispatch('auth/getUserInfo');
      this.dataReady = true;
    }
  },
};
</script>

<style>
.v-icon{
  padding-left: 10px;
}
a {
  text-decoration: none;
}
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
.v-input__slot{
  padding-top: 10px
}
.top-down{
  padding-top: 20px;
  height: 80%;
}
</style>
