<template>
  <div style="display: none">
    <a id="logout_href_err" :href='routes.LOGIN_FAILED'/>
  </div>
</template>

<script>
import {AuthRoutes} from '../utils/constants';
export default {
  name: 'ModalLoginError',
  data() {
    return {
      routes: AuthRoutes
    };
  },
  mounted() {
    window.location = document.getElementById('logout_href_err').href;
  },
  methods: {
    logout() {
      this.$store.commit('auth/setJwtToken');
    }
  }

};
</script>
<style scoped>

</style>
