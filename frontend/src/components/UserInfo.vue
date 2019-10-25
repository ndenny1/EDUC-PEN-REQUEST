<template>
    <v-container>
        <UserCard></UserCard>
    </v-container>
</template>

<script>
import UserCard from './UserCard';
export default {
  name: 'userInfo',
  components: {
    UserCard
  },
  mounted() {
    this.$store.dispatch('user/getUserInfo');
  },
};
</script>

<style scoped>
.container{
  padding: 25px 0px 100px 0px;
  width: 55%;
}
</style>
