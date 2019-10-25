<template>
    <v-card>
        <v-card-title>User Info</v-card-title>
        <v-card-text v-if="userInfo === null">
          Error getting user info
        </v-card-text>
        <v-card-text v-else>
          {{ userInfo._json }}
        </v-card-text>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'userCard',
  computed: {
    ...mapGetters('auth', ['userInfo'])
  }
};
</script>

<style scoped>
.v-card{
    padding: 20px;
}
</style>
