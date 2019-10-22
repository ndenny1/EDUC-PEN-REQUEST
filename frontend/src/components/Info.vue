<template>
    <div class="word-container">
        <h2 class="gov-header"> <v-icon large color="#003366">info</v-icon>About PEN Retrieval</h2>
        <p class="paragraph">
            The PEN Retrieval application is aimed at making it fast and easy for students to get their PEN. 
            This application strives to be widely accessible and easily usable for all potential users.
        </p>
        <h4 class='gov-header'>What is a PEN?</h4>
        <p class="paragraph">
            A PEN (Personal Education Number) is used to identify a students in the BC School System. 
            Each student's PEN is associated with their transcripts, student information (current school district, current school, etc), and other data pertaining to their education. 
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
            Every student in British Columbia has a PEN. Currently, a child is assigned a PEN as soon as they enter the BC School System. 
            A rewrite to the PEN registry (expected release Winter 2021) will assign a PEN to a child when they are born.
        </p>
    </div>
</template>

<script>
export default {
  name: 'Info',
  data() {
    return {
            
    };
  },
};
</script>

<style scoped>
    .v-icon{
        padding-right: 10px;
    }
    .gov-header{
        color: #003366;
        padding: 10px 0px;
    }
    .word-container{
        max-width: 900px;
        width: 55%;
    }
    .paragraph{
        padding-bottom: 15px;
    }
</style>
