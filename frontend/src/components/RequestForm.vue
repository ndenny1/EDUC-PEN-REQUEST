<template>
    <v-card class="mainCard">
        <v-card-title><h3>PEN Request Form</h3></v-card-title>
        <v-card-subtitle>Student Information</v-card-subtitle>
        <v-form
          @submit="submitForm"
          ref="form"
          v-model="validForm"
          lazy-validation
        >
          <v-card-text>
              <v-row>
                  <v-col>
                      <v-text-field v-model="user.legalLastName" color="#003366" outlined :rules="requiredRules" required label="Legal Last Name"></v-text-field>
                  </v-col>
              </v-row>
              <v-row class="bottom_group">
                  <v-col>
                      <v-text-field  v-model="user.legalFirstName" color="#003366" hint="Optional (if you have one name, use legal last name box)" outlined label="Legal First Name(s)"></v-text-field>
                  </v-col>
                  <v-col>
                      <v-text-field v-model="user.legalMiddleName" color="#003366" hint="Optional" outlined label="Legal Middle Name(s)"></v-text-field>
                  </v-col>
              </v-row>
              <v-row class="top_group">
                  <v-col>
                      <v-text-field v-model="user.usualLastName" color="#003366" outlined  hint="If different from legal last name" label="Usual Last Name"></v-text-field>
                  </v-col>
              </v-row>
              <v-row class="bottom_group">
                  <v-col>
                      <v-text-field v-model="user.usualFistName" color="#003366" outlined  hint="If different from legal first name(s)" label="Usual First Name(s)"></v-text-field>
                  </v-col>
                  <v-col>
                      <v-text-field v-model="user.usualMiddleName" color="#003366" outlined  hint="If different from legal middle name(s)" label="Usual Middle Name(s)"></v-text-field>
                  </v-col>
              </v-row>
              <v-row class="top_group">
                  <v-col>
                      <v-text-field v-model="user.maidenName" color="#003366"  hint="Optional" outlined label="Maiden Name"></v-text-field>
                  </v-col>
                  <v-col>
                      <v-text-field v-model="user.pastNames" color="#003366" hint="Optional"  outlined label="Past Name(s)"></v-text-field>
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
                              v-model="user.dob"
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
                          v-model="user.dob"
                          show-current
                          :max="new Date().toISOString().substr(0, 10)"
                          min="1903-01-01"
                          @change="save"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                <v-col>
                  <v-select color="#003366" v-model="user.genderCode" required :rules="requiredRules" outlined :items="genders" label="Gender"></v-select>
                </v-col>
              </v-row>
              <v-row class="bottom_group">
                  <v-col>
                      <v-text-field v-model="user.email" required :rules="emailRules" color="#003366" outlined label="E-mail Address"></v-text-field>
                  </v-col>
              </v-row>
              <v-row class="top_group">
                <v-col>
                  <v-text-field v-model="user.lastBCSchool" color="#003366" outlined label="Last B.C. School Attended"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field v-model="user.lastBCSchoolStudentNumber" color="#003366" hint="Optional"  outlined label="School Student ID Number"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field v-model="user.currentSchool" color="#003366" outlined label="Current B.C. School Attending"></v-text-field>
                </v-col>
              </v-row>
          </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="#003366"
              class="white--text"
              id="submit_form"
              type="submit"
              :disabled="!validForm"
              @click="submitForm"
            >
            Submit
            </v-btn>
        </v-card-actions>
       </v-form> 
    </v-card>        
</template>

<script>
import apiAxios from '../common/apiService';
import ApiRoutes from '../utils/constants';
export default {
  data() {
    return {
      genders: ['Male', 'Female', 'Gender Diverse', 'Unknown'],
      requiredRules: [v => !!v || 'Required'],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      menu: false,
      entries: [],
      isLoading: false,
      model: null,
      search: null,
      nameLimit: 80,
      validForm: true,
      user: {
        legalLastName: null,
        legalFirstName: null,
        legalMiddleName: null,
        usualLastName: null,
        usualFirstName: null,
        usualMiddleName: null,
        maidenNames: null,
        pastName: null,
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

    fields () {
      if (!this.model) return [];

      return Object.keys(this.model).map(key => {
        return {
          key,
          value: this.model[key] || 'n/a',
        };
      });
    }
  },
  watch: {
    menu (val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'));
    },
  },
  methods: {
    save (date) {
      this.$refs.menu.save(date);
    },
    validate() {
      this.$refs.form.validate();
    },
    async submitForm() {
      this.validate();
      console.log(this.user);
      if(this.validForm){
        await apiAxios.post(ApiRoutes.PEN_REQUEST, this.user);
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
.v-card-text{
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
