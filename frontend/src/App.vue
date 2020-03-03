<template>
  <v-app id="app">
    <Header/>
    <ModalIdle v-if="isAuthenticated && isIdle"/>
    <router-view/>
    <Footer/>
  </v-app>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import HttpStatus from 'http-status-codes';
import Header from './components/Header';
import Footer from './components/Footer';
import ModalIdle from './components/ModalIdle';

export default {
  name: 'app',
  components: {
    Header,
    Footer,
    ModalIdle
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated']),
    isIdle(){
      return this.$store.state.idleVue.isIdle;
    }
  },
  methods: {
    ...mapMutations('auth', ['setLoading']),
    ...mapActions('auth', ['getJwtToken', 'getUserInfo', 'logout']),
    ...mapActions('penRequest', ['getCodes'])
  },
  async created() {
    this.setLoading(true);
    this.getJwtToken().then(() => 
      Promise.all([this.getCodes(), this.getUserInfo()])
    ).catch(e => {
      if(! e.response || e.response.status !== HttpStatus.UNAUTHORIZED) {
        this.logout();
        this.$router.replace({name: 'error', query: { message: `500_${e.data || 'ServerErro'}` } });
      }
    }).finally(() => 
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
h1 {
  font-size: 1.25rem;
}
.v-toolbar__title{
  font-size: 1rem
}
@media screen and (max-width: 300px) {

  .v-toolbar__title{
    font-size: 1rem;
    line-height: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  h1 {
    font-size: 1.3rem;
  }
}

@media screen and (min-width: 301px) and (max-width: 600px) {
  .v-toolbar__title{
    font-size: 0.9rem;
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  h1 {
    font-size: 1rem;
  }
}

@media screen and (min-width: 601px) and (max-width: 700px) {
  .v-toolbar__title{
    font-size: 1rem;
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  h1 {
    font-size: 1.2rem;
  }
}

</style>
