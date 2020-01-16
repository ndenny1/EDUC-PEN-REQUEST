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
                      <v-text-field v-model="userPost.legalLastName" color="#003366" outlined :rules="requiredRules" required label="Legal Last Name"></v-text-field>
                  </v-col>
              </v-row>
              <v-row class="bottom_group">
                  <v-col>
                      <v-text-field  v-model="userPost.legalFirstName" color="#003366" hint="Optional (if you have one name, use legal last name box)" outlined label="Legal First Name(s)"></v-text-field>
                  </v-col>
                  <v-col>
                      <v-text-field v-model="userPost.legalMiddleNames" color="#003366" hint="Optional" outlined label="Legal Middle Name(s)"></v-text-field>
                  </v-col>
              </v-row>
              <v-row class="top_group">
                  <v-col>
                      <v-text-field v-model="userPost.usualLastName" color="#003366" outlined  hint="If different from legal last name" label="Usual Last Name"></v-text-field>
                  </v-col>
              </v-row>
              <v-row class="bottom_group">
                  <v-col>
                      <v-text-field v-model="userPost.usualFirstName" color="#003366" outlined  hint="If different from legal first name(s)" label="Usual First Name(s)"></v-text-field>
                  </v-col>
                  <v-col>
                      <v-text-field v-model="userPost.usualMiddleName" color="#003366" outlined  hint="If different from legal middle name(s)" label="Usual Middle Name(s)"></v-text-field>
                  </v-col>
              </v-row>
              <v-row class="top_group">
                  <v-col>
                      <v-text-field v-model="userPost.maidenName" color="#003366"  hint="Optional" outlined label="Maiden Name"></v-text-field>
                  </v-col>
                  <v-col>
                      <v-text-field v-model="userPost.pastNames" color="#003366" hint="Optional"  outlined label="Past Name(s)"></v-text-field>
                  </v-col>
              </v-row>
              <v-row>
                  <v-col>
                    <v-menu
                      ref="menu"
                      v-model="menu"
                      :close-on-content-click="false"
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
                  <v-select color="#003366" v-model="userPost.genderCode" required :rules="requiredRules" outlined :items="genderCodeLabels" label="Gender"></v-select>
                </v-col>
              </v-row>
              <v-row class="bottom_group">
                  <v-col>
                      <v-text-field v-model="userPost.email" required :rules="emailRules" color="#003366" outlined label="E-mail Address"></v-text-field>
                  </v-col>
              </v-row>
              <v-row class="top_group">
                <v-col>
                  <v-text-field v-model="userPost.lastBCSchool" color="#003366" hint="Optional" outlined label="Last B.C. School Attended"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field v-model="userPost.lastBCSchoolStudentNumber" color="#003366" hint="Optional"  outlined label="School Student ID Number"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field v-model="userPost.currentSchool" color="#003366" hint="Optional" outlined label="Current B.C. School Attending"></v-text-field>
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
              @click="dialog = false"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>        
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      genders: [],
      requiredRules: [v => !!v || 'Required'],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
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
      dialogMessage: null,
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
        genderCode: [],
        genderCodeLabels: null,
        email: null,
        lastBCSchool: null,
        lastBCSchoolStudentNumber: null,
        currentSchool: null
      }
    };
  },
  computed: {
    ...mapGetters('auth', ['userInfo']),
    dataReady () {
      if(this.userInfo !== null){
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
  async mounted() {
    const genderCodes = await this.$store.dispatch('penRequest/getGenderCodes');
    this.genders = genderCodes.map(a => a.label);
    console.log(this.genders);
    //this.userPost.legalLastName = this.userInfo.lastName;
    this.userPost.legalFirstName = this.userInfo.firstName;
    //this.userPost.email = this.userInfo.emailAddress;
    this.userPost.legalMiddleNames = this.userInfo.middleNames;
  },
  methods: {
    save (date) {
      this.$refs.menu.save(date);
    },
    validate() {
      this.$refs.form.validate();
    },
    async submitRequestForm() {
      this.validate();
      console.log(this.userInfo);
      if(this.validForm){
        try{
          this.userPost.digitalID = this.userInfo.digitalIdentityID;
          this.userPost.dataSourceCode = this.userInfo.accountType;
          const code = this.genderCode.filter(it => (it.label === this.userPost.genderCode));
          this.userPost.genderCode = code.genderCode;

          if(this.userPost.dataSourceCode === 'BCEID'){
            this.userPost.dataSourceCode = 'DIRECT';
          }

          const resStatus = await this.$store.dispatch('penRequest/postRequest', this.userPost);
          if(resStatus){
            this.$refs.form.reset();
            this.dialogMessage = 'Form submit success!';
            this.dialog = true;
          } else {
            this.$refs.form.reset();
            this.dialogMessage = 'Form submit failure.';
            this.dialog = true;
          }
        } catch (e) {
          throw e;
        }
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
