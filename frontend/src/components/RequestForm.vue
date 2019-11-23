<template>
    <v-card :width="currentWidth" class="mainCard">
        <v-card-title><h3>PEN Request Form</h3></v-card-title>
        <v-card-subtitle>{{ currentSubtitle }}</v-card-subtitle>
        <v-form
          method="post"
          action="/api/pen/request"
          ref="form"
          v-model="validForm"
          lazy-validation
        >
        <v-window v-model="step">

            <v-window-item :value="1">
                <v-card-text>
                    <v-row>
                        <v-col>
                            <v-text-field id="legal_surname" color="#003366" outlined :rules="requiredRules" required label="Legal Last Name"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="bottom_group">
                        <v-col>
                            <v-text-field  id="legal_first_name" color="#003366" hint="Optional (if you have one name, use legal last name box)" outlined label="Legal First Name(s)"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field id="legal_middle_name" color="#003366" hint="Optional" outlined label="Legal Middle Name(s)"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="top_group">
                        <v-col>
                            <v-text-field id="usual_surname" color="#003366" outlined  hint="If different from legal last name" label="Usual Last Name"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="bottom_group">
                        <v-col>
                            <v-text-field id="usual_first_name" color="#003366" outlined  hint="If different from legal first name(s)" label="Usual First Name(s)"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field id="usual_middle_name" color="#003366" outlined  hint="If different from legal middle name(s)" label="Usual Middle Name(s)"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="top_group">
                        <v-col>
                            <v-text-field id="maiden_name" color="#003366"  hint="Optional" outlined label="Maiden Name"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field id="past_names" color="#003366" hint="Optional"  outlined label="Past Name(s)"></v-text-field>
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
                        <v-select color="#003366" id="gender" required :rules="requiredRules" outlined :items="genders" label="Gender"></v-select>
                      </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field id="email_address" required :rules="emailRules" color="#003366" outlined label="E-mail Address"></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-window-item>

            <v-window-item :value=2>
                <v-card-text>
                    <v-row>
                        <v-text-field id="last_bc_school" color="#003366" outlined label="Last B.C. School Attended"></v-text-field>
                    </v-row>
                    <v-row>
                        <v-text-field id="student_id_number" color="#003366" hint="Optional"  outlined label="School Student ID Number"></v-text-field>
                    </v-row>
                    <v-row>
                        <v-text-field id="current_school" color="#003366" outlined label="Current B.C. School Attending"></v-text-field>
                    </v-row>
                </v-card-text>
            </v-window-item>


        </v-window>

        <v-card-actions>
            <v-btn
            :disabled="step === 1"
            text
            @click="step--"
            >
            Back
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
                v-if="step !== 2"
                color="#003366"
                dark
                id="next"
                depressed
                :disabled="!validForm"
                type="submit"
            >
            Next
            </v-btn>
            <v-btn
              v-else
              color="#003366"
              dark
              id="submit_form"
              depressed
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
      sexes: ['Male', 'Female', 'Intersex', 'Unknown'],
      step: 1,
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
    submit() {
      window.location.pathname = '/';
    },
    save (date) {
      this.$refs.menu.save(date);
    },
    validate() {
      this.$refs.form.validate();
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
