<template>
  <article id="user-info-container" class="background">
    <v-container>
        <UserCard></UserCard>
    </v-container>
  </article>
</template>

<script>
import UserCard from './UserCard';
import { mapGetters } from 'vuex';
export default {
  name: 'userInfo',
  components: {
    UserCard
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated']),
  },
  mounted() {
    if(!(this.isAuthenticated)){
      window.location.href = '/';
    }
  },
};
</script>

<style scoped>
.container{
  padding: 25px 0px 100px 0px;
  max-width: 380px;
  top: 40px;
}
.background{
  background-image: url("https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80");
  min-height: 500px;
  background-size: cover;
  display: flex;
  height: 100%;
  width: 100%;
}
</style>
