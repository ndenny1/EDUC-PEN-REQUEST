<template>
    <v-container class="container-login-card">
        <v-col xs="8" sm="8" md="8" lg="8" xl="8" offset-xs="2" offset-sm="2" offset-md="2" offset-lg="2" offset-xl="2">
            <v-card outlined  dark color="#003366">
                <v-card-title> <v-icon>$login</v-icon><span class="login-cards-display-header">Easy Log In</span> </v-card-title>
                <v-card-text><span class="login-cards-display-text">
                    Log In using a Basic BCeID or B.C. Services Card.</span>
                </v-card-text>
                <v-card-actions>
                    <v-btn width="48%" href="https://www.bceid.ca/" outlined><span class="login-cards-display-text">About BCeID</span></v-btn>
                    <v-btn width="50%" href="https://www2.gov.bc.ca/gov/content/governments/government-id/bc-services-card" outlined><span class="login-cards-display-text-sc">About B.C. Services Card</span></v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
        <v-col xs="8" sm="8" md="8" lg="8" xl="8"  offset-xs="2" offset-sm="2" offset-md="2" offset-lg="2" offset-xl="2">
            <v-card outlined  dark color="#6c757d">
                <v-card-title> <v-icon>$fast</v-icon><span class="login-cards-display-header">Fast Results</span></v-card-title>
                <v-card-text><span class="login-cards-display-text">
                    The {{ appTitle }} app instantly returns your PEN if it can confidently identify the user. If you can not be instantly identified, you will receive an email once manual identification has been completed.
                </span></v-card-text>
            </v-card>
        </v-col>
    </v-container>
</template>

<script>
export default {
  name: 'LoginCards',
  data() {
    return {
      appTitle: process.env.VUE_APP_TITLE,
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
.container-login-card{
    padding-bottom: 5vh;
}
.login-cards-display-header{
    font-size: 2vh;
}
.login-cards-display-text{
    font-size: 1.8vh;
}
.login-cards-display-text-sc{
    font-size: 1.7vh;
}
@media screen and (min-width: 601px) and (max-width:900px) {
    .container-login-card{
        padding-bottom: 4vh !important;
    }
    .login-cards-display-header{
        font-size: 2vh;
    }
    .login-cards-display-text{
        font-size: 1.8vh;
    }
    .login-cards-display-text-sc{
        font-size: 1.6vh;
    }
}
@media screen and (min-width: 301px) and (max-width: 600px){
    .container-login-card{
        padding-bottom: 18vh !important;
    }
    .login-cards-display-header{
        font-size: 3vh;
    }
    .login-cards-display-text{
        font-size: 1.5vh;
    }
    .login-cards-display-text-sc{
        font-size: 1.4vh;
    }
}

@media screen and (max-width: 300px) {
    .container-login-card{
        padding-bottom: 40% !important;
    }
    .login-cards-display-header{
        font-size: 2vh;
    }
    .login-cards-display-text{
        font-size: 1.2vh;
    }
    .login-cards-display-text-sc{
        font-size: 1vh;
    }
}
</style>
