<template>
  <v-container style="padding-bottom: 1vh">
    <v-col xs="8" sm="8" md="8" lg="8" xl="8"  offset-xs="2" offset-sm="2" offset-md="2" offset-lg="2" offset-xl="2">
        <h2 class="gov-header">
          <v-icon large color="#003366">info</v-icon>
          About PEN Request
        </h2>
        <p class="paragraph">
          The {{ appTitle }} application is aimed at making it fast and easy for students to get their PEN.
          This application strives to be widely accessible and easily usable for all potential users.
        </p>
        <h4 class='gov-header'>What is a PEN?</h4>
        <p class="paragraph">
          A PEN (Personal Education Number) is used to identify a students in the BC School System.
          Each student's PEN is associated with their transcripts, student information (current school district, current
          school, etc), and other data pertaining to their education.
        </p>
        <h4 class="gov-header">What can a PEN be used for?</h4>
        <p>
          Your PEN can be used to:
        </p>
        <ul class="paragraph">
          <li>Register for Kindergarten online</li>
          <li>Register for summer school online</li>
          <li>Register to Post Secondary Schools in BC</li>
          <li>Create a BCeID to access the Student Transcript Service</li>
        </ul>
        <h4 class="gov-header">Who has a PEN?</h4>
        <p class="paragraph">
          Every student in British Columbia has a PEN. Currently, a child is assigned a PEN as soon as they enter the BC
          School System.
          A rewrite to the PEN registry (expected release Winter 2021) will assign a PEN to a child when they are born.
        </p>
    </v-col>
  </v-container>
</template>

<script>
export default {
  name: 'Info',
  data() {
    return {
      appTitle: process.env.VUE_APP_TITLE,
    };
  },
};
</script>

<style scoped>
  .v-icon {
    padding-right: 10px;
  }

  .gov-header {
    color: #003366;
    padding: 10px 0px;
  }


  .paragraph {
    padding-bottom: 15px;
  }
</style>
