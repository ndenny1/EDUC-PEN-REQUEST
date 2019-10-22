<template>
    <v-row class="centerInfo" align="center" justify="center">
        <v-col md="auto" height=100% class="half-card">
            <v-card outlined height='170px' dark color="#003366">
                <v-card-title> <v-icon>$login</v-icon> Easy Login</v-card-title>
                <v-card-text>
                    Login using a Basic BCeID or BC Services Card.
                </v-card-text>
                <v-card-actions class="card-actions">
                    <v-btn width="50%" href="https://www.bceid.ca/" outlined>About BCeID</v-btn>
                    <v-btn width="50%" href="https://www2.gov.bc.ca/gov/content/governments/government-id/bc-services-card" outlined>About BC Services Card</v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
        <v-col md="auto" class="half-card">
            <v-card outlined height='170px' dark color="#6c757d">
                <v-card-title> <v-icon>$fast</v-icon>Fast Results</v-card-title>
                <v-card-text>
                    The PEN Retrieval app instantly returns your PEN if it can confidently identify the user. If you can not be instantly identified, you will recieve an email once manual identification has been completed.
                </v-card-text>
            </v-card>
        </v-col>
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
.v-icon{
    padding-right: 20px
}
.card-actions{
    padding: 0px 15px;
    width: 100%;
    justify-content: center;
    bottom: 10px;
    position: absolute;
}
.centerInfo{
    max-width: 900px;
    width: 55%;
}
.half-card{
    width: 48%;
}
.full-height{
    height: 170px;
}
.v-card{
    overflow: hidden;
}
.v-btn{
    text-transform: none;
    overflow: hidden;
    font-size: 0.8em
}
</style>
