<template>
    <v-container>
        <v-row align="center" justify="center">
            <Login></Login>
        </v-row>
    </v-container>
</template>

<script>
import Login from './Login';
export default {
  name: 'Landing',
  components: {
    Login
  }
};
</script>
