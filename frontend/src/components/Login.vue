<template>
    <v-card class="login-card">
        <v-card-title class="gov-header">
            <h4>Sign In</h4>
        </v-card-title>
        <v-card-text>
          To access the PEN Retrieval Application, you must have a Basic BCeID or a BC Services Card.
        </v-card-text>
        <v-card-actions>
            <v-row align="center" justify="center">
                <v-btn @click="clearStorage" :href="authRoutes.LOGIN" class="ma-2" dark color='#003366'>Login</v-btn>
            </v-row>
        </v-card-actions>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { AuthRoutes } from '@/utils/constants';
export default {
  name: 'Login',
  data() {
    return {
      authRoutes: AuthRoutes
    };
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated']),
  },
  methods: {
    clearStorage() {
      this.$store.commit('auth/setJwtToken');
      this.$store.commit('auth/setRefreshToken');
    }
  }
};
</script>

<style scoped>
  .login-card{
    max-width: 400px;
  }
  .gov-header{
    color: #003366;
  }
  .v-btn{
    text-transform: none
  }
</style>
