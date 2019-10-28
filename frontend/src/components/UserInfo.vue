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
  }
};
</script>

<style scoped>
.container{
  padding: 25px 0px 100px 0px;
  max-width: 380px;
}
</style>
