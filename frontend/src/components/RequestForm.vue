<template>
    <v-card class="mainCard" v-if="dataReady">
        <v-card-title><h3>{{ appTitle }} Form</h3></v-card-title>
        <v-card-subtitle>Student Information</v-card-subtitle>
        <v-form
          ref="form"
          v-model="validForm"
          lazy-validation
        >
          <v-card-text class="noPadding">
              <v-row>
                  <v-col>
                    <v-text-field id='legalLastName' :readonly="serviceCardBool" v-model="userPost.legalLastName" color="#003366" outlined :rules="requiredRules" required label="Legal Last Name"></v-text-field>
                  </v-col>
              </v-row>
              <v-row class="bottom_group">
                  <v-col>
                    <v-text-field id='legalFirstName' :readonly="serviceCardBool"  v-model="userPost.legalFirstName" color="#003366" hint="Optional (if you have one name, use legal last name box)" outlined label="Legal First Name(s)"></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field id='legalMiddleNames' :readonly="serviceCardBool" v-model="userPost.legalMiddleNames" color="#003366" hint="Optional" outlined label="Legal Middle Name(s)"></v-text-field>
                  </v-col>
              </v-row>
              <v-row class="top_group">
                  <v-col>
                    <v-text-field id='usualLastName' v-model="userPost.usualLastName" color="#003366" outlined  hint="If different from legal last name" label="Usual Last Name"></v-text-field>
                  </v-col>
              </v-row>
              <v-row class="bottom_group">
                  <v-col>
                      <v-text-field id='usualFirstName' v-model="userPost.usualFirstName" color="#003366" outlined  hint="If different from legal first name(s)" label="Usual First Name(s)"></v-text-field>
                  </v-col>
                  <v-col>
                      <v-text-field id='usualMiddleNames' v-model="userPost.usualMiddleName" color="#003366" outlined  hint="If different from legal middle name(s)" label="Usual Middle Name(s)"></v-text-field>
                  </v-col>
              </v-row>
              <v-row class="top_group">
                  <v-col>
                      <v-text-field id='maidenName' v-model="userPost.maidenName" color="#003366"  hint="Optional" outlined label="Maiden Name"></v-text-field>
                  </v-col>
                  <v-col>
                      <v-text-field id='pastNames' v-model="userPost.pastNames" color="#003366" hint="Optional"  outlined label="Past Name(s)"></v-text-field>
                  </v-col>
              </v-row>
              <v-row>
                  <v-col>
                    <v-menu
                      ref="menu"
                      v-model="menu"
                      :close-on-content-click="false"
                      :disabled="serviceCardBool"
                      transition="scale-transition"
                      offset-y
                      full-width
                      min-width="290px"
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
                              required
                              :rules="requiredRules"
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
                <v-col>
                  <v-select id='gender' color="#003366" :readonly="serviceCardBool" v-model="genderLabel" required :rules="requiredRules" outlined :items="genderLabels" label="Gender"></v-select>
                </v-col>
              </v-row>
              <v-row class="bottom_group">
                  <v-col>
                      <v-text-field id='email' :readonly="serviceCardBool" v-model="userPost.email" required :rules="emailRules" color="#003366" outlined label="E-mail Address"></v-text-field>
                  </v-col>
              </v-row>
              <v-row class="top_group">
                <v-col>
                  <v-text-field id='lastBCSchool' v-model="userPost.lastBCSchool" color="#003366" hint="Optional" outlined label="Last B.C. School Attended"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field id='lastBCStudentNumber' v-model="userPost.lastBCSchoolStudentNumber" color="#003366" hint="Optional"  outlined label="School Student ID Number"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field id='currentSchool' v-model="userPost.currentSchool" color="#003366" hint="Optional" outlined label="Current B.C. School Attending"></v-text-field>
                </v-col>
              </v-row>
          </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="#003366"
              class="white--text"
              id="submit_form"
              @click="submitRequestForm"
              :disabled="!validForm"
            >
            Submit
            </v-btn>
        </v-card-actions>
       </v-form>
       <v-dialog
        v-model="dialog"
        width="500"
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
import { mapGetters, mapMutations } from 'vuex';
export default {
  data() {
    return {
      genderLabels: [],
      requiredRules: [v => !!v || 'Required'],
      emailRules: [
        v => !!v || 'Required',
        v => /^[\w!#$%&’*+/=?`{|}~^-]+(?:\.[\w!#$%&’*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}$/.test(v) || 'E-mail must be valid',
      ],
      menu: false,
      appTitle: process.env.VUE_APP_TITLE,
      entries: [],
      isLoading: false,
      model: null,
      search: null,
      nameLimit: 80,
      validForm: true,
      dialog: false,
      isSubmitted: false,
      dialogMessage: null,
      apiGenderCodes: [],
      genderLabel: null,
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
      if(this.userInfo !== null){
        return true;
      }
      return false;
    },
    serviceCardBool () {
      if(this.dataReady && this.userInfo.accountType === 'BCSC'){
        return true;
      }
      return false;
    }
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
    ...mapMutations('auth', ['setPenRequest']),
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

          const resData = await this.$store.dispatch('penRequest/postRequest', this.userPost);
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
        }
      }
    },
    closeDialog() {
      this.dialog = false;
      if(this.isSubmitted) {
        this.$router.replace({name: 'home'});
      }
    }
  },
};
</script>

<style scoped>
.mainCard{
    margin: 20px 0px;
    padding:10px;
    max-width: 1000px;
    min-width: 500px;
    width: 65%;
}
.v-dialog > .v-card > .v-card__text {
  padding: 24px 24px 20px;
}
.noPadding{
    padding-top: 0px;
    margin-top: 0px;
}
.col{
  padding: 0px 10px;
}

.top_group{
  padding-top: 15px;
}

.bottom_group{
  padding-bottom: 15px;
}
</style>
