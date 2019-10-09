<template>
  <v-container>
    <h1>{{msg}}</h1>
  </v-container>
</template>

<script>
export default {
  name: 'home',
  data() {
    return { msg: 'Hi Scott & Greg!' };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
