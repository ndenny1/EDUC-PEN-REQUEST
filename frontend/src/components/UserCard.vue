<template>
    <v-card>
        <v-list-item dark>
          <v-list-item-avatar size='50px' color="info">{{ userLetter }}</v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title><h2>{{ userInfo.displayName }}</h2></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-card-text v-if="userInfo === null">
          Error getting user info
        </v-card-text>
        <v-card-text v-else-if="accountType === 'bceid'">
          <v-row>
            <v-col><b>First Name: </b></v-col>
            <v-col><p> {{ userInfo._json.given_name }}</p></v-col>
          </v-row>
          <v-row>
            <v-col><b>Last Name: </b></v-col>
            <v-col><p> {{ userInfo._json.family_name }}</p></v-col>
          </v-row>
          <v-row>
            <v-col><b>Middle Name(s): </b></v-col>
            <v-col v-if="!userInfo.middle_name"><p> N/A </p></v-col>
            <v-col v-else><p>{{ userInfo._json.middle_name }}</p></v-col>
          </v-row>
          <v-row>
            <v-col><b>Email: </b></v-col>
            <v-col><p> {{ userInfo._json.email }}</p></v-col>
          </v-row>
          <v-row>
            <v-col><b>Account Type: </b></v-col>
            <v-col><p>{{ accountType }}</p></v-col>
          </v-row>
        </v-card-text>
        <v-card-text v-else>
          Nice try pal, we don't use IDIR in this town
        </v-card-text>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'userCard',
  computed: {
    ...mapGetters('auth', ['userInfo']),
    userLetter: function() {
      return this.userInfo.displayName[0];
    }
  },
  mounted() {
    this.getAccountType(); 
  },
  data() {
    return {
      accountType: null
    };
  },
  methods: {
    getAccountType() {
      const res = this.userInfo._json.preferred_username.split('@');
      this.accountType = res[1];
    }
  },
};
</script>

<style scoped>
.v-list-item{
  background-color: #003366
}
.v-list-item__avatar{
  justify-content: center !important
}
h2{
  line-height: 1.5;
}
</style>
