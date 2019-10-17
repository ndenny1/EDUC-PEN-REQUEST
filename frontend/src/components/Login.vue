<template>
    <v-card>
        <v-card-title>
            Login to PEN Retrieval
        </v-card-title>
        <v-card-text>
            <v-row align="center" justify="center">
                <v-btn @click='clearStorage' :href="authRoutes.LOGIN" class="ma-2" dark color='#003366'>Login</v-btn>
            </v-row>
        </v-card-text>
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
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('refreshToken');
    }
  }
};
</script>
