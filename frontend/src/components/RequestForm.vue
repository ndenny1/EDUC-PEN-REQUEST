<template>
    <v-card :width="currentWidth" class="mainCard">
        <v-card-title><h3>PEN Request Form</h3></v-card-title>
        <v-card-subtitle>{{ currentSubtitle }}</v-card-subtitle>
        <v-form
          ref="form"
          v-model="validForm"
          lazy-validation
        >
          <v-card-text>
              <v-row>
                  <v-col>
                      <v-text-field v-model="legalLastName" color="#003366" outlined :rules="requiredRules" required label="Legal Last Name"></v-text-field>
                  </v-col>
              </v-row>
              <v-row class="bottom_group">
                  <v-col>
                      <v-text-field  v-model="legalFirstName" color="#003366" hint="Optional (if you have one name, use legal last name box)" outlined label="Legal First Name(s)"></v-text-field>
                  </v-col>
                  <v-col>
                      <v-text-field v-model="legalMiddleName" color="#003366" hint="Optional" outlined label="Legal Middle Name(s)"></v-text-field>
                  </v-col>
              </v-row>
              <v-row class="top_group">
                  <v-col>
                      <v-text-field v-model="usualLastName" color="#003366" outlined  hint="If different from legal last name" label="Usual Last Name"></v-text-field>
                  </v-col>
              </v-row>
              <v-row class="bottom_group">
                  <v-col>
                      <v-text-field v-mdoel="usualFistName" color="#003366" outlined  hint="If different from legal first name(s)" label="Usual First Name(s)"></v-text-field>
                  </v-col>
                  <v-col>
                      <v-text-field v-model="usualMiddleName" color="#003366" outlined  hint="If different from legal middle name(s)" label="Usual Middle Name(s)"></v-text-field>
                  </v-col>
              </v-row>
              <v-row class="top_group">
                  <v-col>
                      <v-text-field v-model="maidenName" color="#003366"  hint="Optional" outlined label="Maiden Name"></v-text-field>
                  </v-col>
                  <v-col>
                      <v-text-field v-model="pastName" color="#003366" hint="Optional"  outlined label="Past Name(s)"></v-text-field>
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
                              v-model="date"
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
                          v-model="date"
                          show-current
                          :max="new Date().toISOString().substr(0, 10)"
                          min="1903-01-01"
                          @change="save"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                <v-col>
                  <v-select color="#003366" v-model="gender" required :rules="requiredRules" outlined :items="genders" label="Gender"></v-select>
                </v-col>
              </v-row>
              <v-row class="bottom_group">
                  <v-col>
                      <v-text-field v-model="email" required :rules="emailRules" color="#003366" outlined label="E-mail Address"></v-text-field>
                  </v-col>
              </v-row>
              <v-row class="top_group">
                <v-col>
                  <v-text-field v-model="lastSchool" color="#003366" outlined label="Last B.C. School Attended"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field v-model="studentIDNumber" color="#003366" hint="Optional"  outlined label="School Student ID Number"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field v-model="currentSchool" color="#003366" outlined label="Current B.C. School Attending"></v-text-field>
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
              @click="submit"
            >
            Submit
            </v-btn>
        </v-card-actions>
       </v-form> 
    </v-card>        
</template>

<script>
export default {
  data() {
    return {
      genders: ['Male', 'Female', 'Gender Diverse', 'Unknown'],
      date: null,
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
      validForm: true
    };
  },
  computed: {
    currentSubtitle () {
      switch(this.step){
      case 1: return 'Personal Information';
      default: return 'School Information';
      }
    },
    currentWidth () {
      switch(this.step){
      case 1: return '65%';
      default: return '40%';
      }
    },
    fields () {
      if (!this.model) return [];

      return Object.keys(this.model).map(key => {
        return {
          key,
          value: this.model[key] || 'n/a',
        };
      });
    },
    countries () {
      return this.entries.map(entry => {
        const Name = entry.name;

        return Object.assign({}, entry, { Name });
      });
    },
  },
  watch: {
    menu (val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'));
    },
    search () {
      // Items have already been loaded
      if (this.countries.length > 0) return;

      // Items have already been requested
      if (this.isLoading) return;

      this.isLoading = true;

      // Lazily load input items
      fetch('https://restcountries.eu/rest/v2/all')
        .then(res => res.json())
        .then(res => {
          this.entries = res;
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => (this.isLoading = false));
    },
  },
  methods: {
    save (date) {
      this.$refs.menu.save(date);
    },
    validate() {
      this.$refs.form.validate();
    },
    submit() {
      this.validate();
      console.log(this.$refs.form);
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
