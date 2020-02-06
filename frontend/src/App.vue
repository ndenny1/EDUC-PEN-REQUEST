<template>
  <v-app id="app">
    <Header/>
    <router-view/>
    <Footer/>
  </v-app>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import Header from './components/Header';
import Footer from './components/Footer';

export default {
  name: 'app',
  components: {
    Header,
    Footer
  },
  methods: {
    ...mapMutations('auth', ['setLoading']),
    ...mapActions('auth', ['getJwtToken', 'getUserInfo'])
  },
  async created() {
    this.setLoading(true);
    this.getJwtToken().then(() => 
      this.getUserInfo()
    ).finally(() => 
      this.setLoading(false)
    );
  }
};
</script>

<style>
.v-application {
  font-family: 'BCSans', Verdana, Arial, sans-serif !important;
}
.v-card--flat {
  background-color: transparent !important;
}
.theme--light.application{
  background: #f1f1f1;
}
</style>
