<template>
    <v-container>
        <UserCard></UserCard>
    </v-container>
</template>

<script>
import UserCard from './UserCard';
import { mapGetters } from 'vuex;'
export default {
  name: 'userInfo',
  components: {
    UserCard
  },
  computed: {
    ...mapGetters('user', ['userInfo'])
  },
  async created() {
    if(!(this.userInfo)){
      await this.$store.dispatch('user/getUserInfo');
    }
  },
};
</script>

<style scoped>
.container{
  padding: 25px 0px 100px 0px;
  width: 55%;
}
</style>
