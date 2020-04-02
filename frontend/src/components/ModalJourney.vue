<template>
  <div style="display: none">
    <a id="journey_href" :href='journeyBuilder'/>
  </div>
</template>

<script>
export default {
  name: 'ModalJourney',
  computed:{
    journeyBuilder(){
      if(config.VUE_APP_JOURNEY_BUILDER){
        return config.VUE_APP_JOURNEY_BUILDER;
      }
      return 'https://www2.qa.gov.bc.ca/gov/content/education-training/k-12/support/pen';
    }
  },
  mounted() {
    console.log(this.journeyBuilder);
    window.location = document.getElementById('journey_href').href;
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
