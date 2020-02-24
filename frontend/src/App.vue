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
    ...mapActions('auth', ['getJwtToken', 'getUserInfo']),
    ...mapActions('penRequest', ['getGenderCodes'])
  },
  async created() {
    this.setLoading(true);
    this.getJwtToken().then(() => 
      Promise.all([this.getUserInfo(), this.getGenderCodes()])
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
@media screen and (max-width: 300px) {

  .v-toolbar__title{
    font-size: 1rem;
    line-height: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

@media screen and (min-width: 301px) and (max-width: 350px) {
  .v-toolbar__title{
    font-size: 0.6rem;
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

}
@media screen and (min-width: 351px) and (max-width: 400px) {
  .v-toolbar__title{
    font-size: 0.7rem;
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

}
@media screen and (min-width: 401px) and (max-width: 600px) {
  .v-toolbar__title{
    font-size: 0.8rem;
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

@media screen and (min-width: 601px) and (max-width: 700px) {
  .v-toolbar__title{
    font-size: 0.9rem;
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

</style>
