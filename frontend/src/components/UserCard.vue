<template>
    <v-card v-if="userInfo !== false">
        <v-list-item dark>
          <v-list-item-avatar size='50px' color="info">{{ userInfo.displayName[0] }}</v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title><h2>{{ userInfo.displayName }}</h2></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-card-text v-if="accountType === 'BCEID'">
          <v-row>
            <v-col><b>First Name: </b></v-col>
            <v-col><p id="given_name"> {{ userInfo.firstName }}</p></v-col>
          </v-row>
          <v-row>
            <v-col><b>Last Name: </b></v-col>
            <v-col><p id="family_name"> {{ userInfo.lastName }}</p></v-col>
          </v-row>
          <v-row>
            <v-col><b>Middle Name(s): </b></v-col>
            <v-col v-if="!userInfo.middle_name"><p> N/A </p></v-col>
            <v-col v-else><p id="middle_name">{{ userInfo.middle_name }}</p></v-col>
          </v-row>
          <!--
          <v-row>
            <v-col><b>Email: </b></v-col>
            <v-col v-if="!userInfo.email"><p>N/A</p></v-col>
            <v-col v-else><p id="email"> {{ userInfo.email }}</p></v-col>
          </v-row>
          -->
          <v-row>
            <v-col><b>Account Type: </b></v-col>
            <v-col><p id="account_type">{{ userInfo.accountType }}</p></v-col>
          </v-row>
          <v-row>
            <v-col><b>Personal Education Number: </b></v-col>
            <v-col><p id="account_type">{{ userInfo.pen }}</p></v-col>
          </v-row>
        </v-card-text>
        <v-card-text v-else>
          Nice try pal, we don't use IDIR in this town
        </v-card-text>
    </v-card>
    <v-skeleton-loader type="image" v-else>
    </v-skeleton-loader>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'userCard',
  computed: {
    ...mapGetters('auth', ['userInfo']),
    accountType: function() {
      const res = this.userInfo.preferred_username.split('@');
      return res[1];
    }
  },
  methods: {
    getAccountType(input) {
      const res = input.split('@');
      return res[1];
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
