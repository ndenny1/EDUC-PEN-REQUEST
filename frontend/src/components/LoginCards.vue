<template>
    <v-row class="centerInfo" align="center" justify="center">
        <v-column height=100% class="half-card">
            <v-card class="full-height" dark color="#003366">
                <v-card-title>Easy Login</v-card-title>
                <v-card-text>
                    Login using a Basic BCeID or BC Services Card.
                </v-card-text>
                <v-card-actions class="card-actions">
                    <v-btn width="50%" href="https://www.bceid.ca/" outlined>About BCeID</v-btn>
                    <v-btn width="50%" href="https://www2.gov.bc.ca/gov/content/governments/government-id/bc-services-card" outlined>About BC Services Card</v-btn>
                </v-card-actions>
            </v-card>
        </v-column>
        <v-spacer></v-spacer>
        <v-column class="half-card">
            <v-card class="full-height" dark color="#6c757d">
                <v-card-title>Fast Results</v-card-title>
                <v-card-text>
                    The PEN Retrieval app instantly returns your PEN if it can confidently identify the user. If you can not be instantly identified, you will recieve an email once manual identification has been completed.
                </v-card-text>
            </v-card>
        </v-column>
    </v-row>
</template>

<script>
export default {
  name: 'LoginCards',
  data() {
    return {
            
    };
  },
};
</script>

<style scoped>
.card-actions{
    padding: 0px 15px;
    width: 100%;
    justify-content: center;
    bottom: 10px;
    position: absolute;
}
.centerInfo{
    max-width: 50%;
}
.half-card{
    width: 48%;
}
.full-height{
    height: 170px
}
.v-btn{
    text-transform: none
}
</style>
