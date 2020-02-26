<template>
  <v-card class="mainCard" v-if="dataReady">
    <v-card-title><h3>{{ appTitle }} Form</h3></v-card-title>
    <v-card-subtitle>Student Information</v-card-subtitle>

    <v-card color="#FFECA9" class="pa-3 pb-8 mb-8 mx-3">
      <h3>Guidance:</h3>
      <br/>
      <ul>
        <li>This form can only be completed by the person whose PEN is being requested.</li>
        <li>If you are a parent/guardian see here. (do not currently have the URL TBD but this will likely be on journey builder).</li>
        <li>Enter your legal name exactly as indicated on your Governement Photo ID. </li>
      </ul>
    </v-card>

    <v-form
      ref="form"
      v-model="validForm"
    >
      <v-container fluid>
        <v-row>
          <v-col cols="12" class="py-0 px-2 px-sm-2 px-md-3 px-lg-3 px-xl-3">
            <v-text-field 
              id='legalLastName' 
              :readonly="serviceCardBool" 
              v-model="userPost.legalLastName" 
              color="#003366" 
              outlined
              :rules="requiredRules(legalLastNameHint)"
              :hint="legalLastNameHint"
              label="Legal Last Name"
              width="100%"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" class="py-0 px-2 px-sm-2 px-md-3 px-lg-3 px-xl-3">
            <v-text-field 
              id='legalFirstName' 
              :readonly="serviceCardBool"  
              v-model="userPost.legalFirstName" 
              color="#003366" 
              hint="As shown on current Government Photo ID. Note, If you have ONE name only – enter it into the Legal Last Name field and leave Legal First Name blank" 
              outlined 
              label="Legal First Name(s) (optional)"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" class="py-0 px-2 px-sm-2 px-md-3 px-lg-3 px-xl-3">
            <v-text-field 
              id='legalMiddleNames' 
              :readonly="serviceCardBool" 
              v-model="userPost.legalMiddleNames" 
              color="#003366" 
              hint="As shown on current Government Photo ID" 
              outlined 
              label="Legal Middle Name(s) (optional)"
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="py-0 px-2 px-sm-2 px-md-3 px-lg-3 px-xl-3">
            <v-text-field 
              id='usualLastName' 
              v-model="userPost.usualLastName" 
              color="#003366" 
              outlined  
              hint="Only if different from Legal Last Name" 
              label="Usual Last Name (optional)"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" class="py-0 px-2 px-sm-2 px-md-3 px-lg-3 px-xl-3">
            <v-text-field 
              id='usualFirstName' 
              v-model="userPost.usualFirstName" 
              color="#003366" 
              outlined  
              hint="Only if different from Legal First Name" 
              label="Usual First Name(s) (optional)"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" class="py-0 px-2 px-sm-2 px-md-3 px-lg-3 px-xl-3">
            <v-text-field 
              id='usualMiddleNames' 
              v-model="userPost.usualMiddleName" 
              color="#003366" 
              outlined  
              hint="Only if different from Legal Middle Name" 
              label="Usual Middle Name(s) (optional)"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" class="py-0 px-2 px-sm-2 px-md-3 px-lg-3 px-xl-3">
            <v-text-field 
              id='maidenName' 
              v-model="userPost.maidenName" 
              color="#003366"  
              hint="List all previous Last names used separated with spaces" 
              outlined 
              label="Maiden Name (optional)"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" class="py-0 px-2 px-sm-2 px-md-3 px-lg-3 px-xl-3">
            <v-text-field 
              id='pastNames' 
              v-model="userPost.pastNames" 
              color="#003366" 
              hint="List all previous names used separated with spaces"
              outlined 
              label="Past Name(s) (optional)"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" class="py-0 px-2 px-sm-2 px-md-3 px-lg-3 px-xl-3">
            <v-text-field
              color="#003366"
              outlined
              v-model="userPost.dob"
              label="Birthdate"
              readonly
              id="birthdate"
              v-if="serviceCardBool"
            ></v-text-field>
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="290px"
              v-else
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  color="#003366"
                  outlined
                  v-model="userPost.dob"
                  label="Birthdate"
                  readonly
                  v-on="on"
                  id="birthdate"
                  :rules="requiredRules()"
                ></v-text-field>
              </template>
              <v-date-picker
                id='dob'
                color="#003366"
                ref="picker"
                v-model="userPost.dob"
                show-current
                :max="new Date().toISOString().substr(0, 10)"
                min="1903-01-01"
                @change="save"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" sm="6" class="py-0 px-2 px-sm-2 px-md-3 px-lg-3 px-xl-3">
            <v-select 
              id='gender' 
              color="#003366" 
              :readonly="serviceCardBool" 
              v-model="genderLabel"
              :rules="requiredRules(genderHint)"
              outlined 
              :items="genderLabels"
              :hint="genderHint"
              label="Gender"
            ></v-select>
          </v-col>
          <v-col cols="12" class="py-0 px-2 px-sm-2 px-md-3 px-lg-3 px-xl-3">
            <v-text-field 
              id='email' 
              v-model="userPost.email" 
              :rules="emailRules"
              color="#003366"
              :hint="emailHint"
              outlined 
              label="E-mail Address"
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="py-0 px-2 px-sm-2 px-md-3 px-lg-3 px-xl-3">
            <v-text-field 
              id='lastBCSchool' 
              v-model="userPost.lastBCSchool" 
              color="#003366" 
              hint="Last BC K-12 school or Post Secondary Institute attended" 
              outlined 
              label="Last B.C. School Attended (optional)"
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="py-0 px-2 px-sm-2 px-md-3 px-lg-3 px-xl-3">
            <v-text-field 
              id='lastBCStudentNumber' 
              v-model="userPost.lastBCSchoolStudentNumber" 
              color="#003366" 
              hint="School Issued Local ID"  
              outlined 
              label="School Student ID Number (optional)"
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="py-0 px-2 px-sm-2 px-md-3 px-lg-3 px-xl-3">
            <v-text-field 
              id='currentSchool' 
              v-model="userPost.currentSchool" 
              color="#003366" 
              hint="Current BC K-12 school or Post Secondary Institute" 
              outlined 
              label="Current B.C. School Attending (optional)"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
      <v-container fluid noPadding>
        <v-row class="justify-end">
          <v-col id="declaration" cols="12" sm="7" class="py-0 px-2 px-sm-2 px-md-3 px-lg-3 px-xl-3">
            <v-checkbox
              v-model="declared"
              color="green"
              class="mt-0"
              :rules="requiredRules('')"
            >
              <template v-slot:label>
                <div class="pl-3">
                  I declare that I am submitting a request for my Personal Eductaion Number on my own behalf.
                </div>
              </template>
            </v-checkbox>
          </v-col>
          <v-col cols="12" sm="2" class="align-self-center py-0 px-0">
            <v-card-actions class="justify-end">
              <v-btn
                color="#003366"
                class="white--text align-self-center"
                id="submit_form"
                @click="submitRequestForm"
                :disabled="!validForm"
                :loading="submitting"
              >
                Submit
              </v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <v-dialog
      v-model="dialog"
      width="500px"
    >
      <v-card>
        <v-card-text class="fullPadding">
          {{ dialogMessage }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="closeDialog"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>        
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
export default {
  data() {
    return {
      genderLabels: [],
      genderHint: 'As listed on current Government Photo ID',
      legalLastNameHint: 'As shown on current Government Photo ID. Note, If you have ONE name only – enter it in Legal Last Name field and leave Legal First Name blank',
      emailHint: 'Valid Email Required',
      menu: false,
      appTitle: process.env.VUE_APP_TITLE,
      entries: [],
      isLoading: false,
      model: null,
      search: null,
      nameLimit: 80,
      validForm: false,
      dialog: false,
      isSubmitted: false,
      submitting: false,
      dialogMessage: null,
      apiGenderCodes: [],
      genderLabel: null,
      declared: false,
      userPost: {
        digitalID: null,
        legalLastName: null,
        legalFirstName: null,
        legalMiddleNames: null,
        usualLastName: null,
        usualFirstName: null,
        dataSourceCode: null,
        usualMiddleName: null,
        maidenName: null,
        pastNames: null,
        dob: null,
        genderCode: null,
        email: null,
        lastBCSchool: null,
        lastBCSchoolStudentNumber: null,
        currentSchool: null
      }
    };
  },
  computed: {
    ...mapGetters('auth', ['userInfo']),
    ...mapGetters('penRequest', ['genders']),
    dataReady () {
      return this.userInfo !== undefined;
    },
    serviceCardBool () {
      return this.dataReady && this.userInfo.accountType === 'BCSC';
    },
    emailRules() {
      return  [
        v => !!v || this.emailHint,
        v => /^[\w!#$%&’*+/=?`{|}~^-]+(?:\.[\w!#$%&’*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}$/.test(v) || this.emailHint,
      ];
    },
  },
  watch: {
    menu (val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'));
    },
  },
  mounted() {
    this.genderLabels = this.genders.map(a => a.label);
    //populate form if user is logged in with BCSC
    if(this.userInfo.accountType === 'BCSC'){
      this.userPost.legalLastName = this.userInfo.legalLastName;
      this.userPost.legalFirstName = this.userInfo.legalFirstName;
      this.userPost.legalMiddleNames = this.userInfo.legalMiddleNames;
      this.userPost.email = this.userInfo.email;
      if(this.userInfo.gender === 'male'){
        this.genderLabel = 'Male';
      } else if(this.userInfo.gender === 'female'){
        this.genderLabel = 'Female';
      } else if(this.userInfo.gender === 'unknown'){
        this.genderLabel = 'Unknown';
      }
      this.userPost.usualMiddleName = this.userInfo.usualMiddleNames;
      this.userPost.usualLastName = this.userInfo.usualLastName;
      this.userPost.usualFirstName = this.userInfo.usualFirstName;
      this.userPost.dob = (this.userInfo.dob).substr(0, 10);
    }
  },
  methods: {
    ...mapMutations('penRequest', ['setPenRequest']),
    ...mapActions('penRequest', ['postRequest']),
    requiredRules(hint='Required') {
      return [v => !!v || hint];
    },
    save (date) {
      this.$refs.menu.save(date);
    },
    validate() {
      this.$refs.form.validate();
    },
    async submitRequestForm() {
      this.validate();
      if(this.validForm){
        try{
          const code = this.genders.filter(it => (it.label === this.genderLabel));
          this.userPost.genderCode = code[0].genderCode;

          this.submitting = true;
          const resData = await this.postRequest(this.userPost);
          if(resData){
            this.$refs.form.reset();
            this.dialogMessage = 'Form submit success!';
            this.dialog = true;
            this.isSubmitted = true;
            this.setPenRequest(resData);
          } else {
            //this.$refs.form.reset();
            this.dialogMessage = 'Form submit failure.';
            this.dialog = true;
            this.isSubmitted = false;
          }
        } catch (e) {
          this.dialogMessage = 'Form submit failure.';
          this.dialog = true;
          this.isSubmitted = false;
          throw e;   
        } finally {
          this.submitting = false;
        }
      }
    },
    closeDialog() {
      this.dialog = false;
      if(this.isSubmitted && this.$route.name !== 'home') {
        this.$router.replace({name: 'home'});
      }
    }
  },
};
</script>

<style scoped>
.mainCard{
    margin: 20px 0;
    padding:10px;
    width: 100%;
    /* max-width: 900px; */
}

.v-dialog {
  max-width: 1vw;
}

#declaration /deep/ .v-icon {
    padding-left: 2px;
}

.v-dialog > .v-card > .v-card__text {
  padding: 24px 24px 20px;
}
.noPadding{
    padding-top: 0;
    margin-top: 0;
}
/* .col{
  padding: 0 10px;
}

.col-sm-6{
  padding: 0 10px;
} */

.top_group{
  padding-top: 15px;
}

.bottom_group{
  padding-bottom: 15px;
}
@media screen and (max-width: 300px) {
  .mainCard{
    margin-top: .1vh;
    padding-top: 10px;
    width: 100%;
    margin-bottom: 8rem;
  }
}
@media screen and (min-width: 301px) and (max-width: 600px) {
  .mainCard{
    margin-top: .1vh;
    padding-top: 10px;
    width: 100%;
    margin-bottom: 7rem;
  }
}
@media screen and (min-width: 601px) and (max-width: 900px) {
  .mainCard{
    margin-top: .1vh;
    padding-top: 10px;
    width: 100%;
    margin-bottom: 7rem;
  }
}
</style>
