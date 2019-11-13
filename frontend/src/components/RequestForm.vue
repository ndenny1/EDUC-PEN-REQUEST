<template>
    <v-card :width="currentWidth" class="mainCard">
        <v-card-title><h3>PEN Request Form</h3></v-card-title>
        <v-card-subtitle>{{ currentSubtitle }}</v-card-subtitle>
        <!--<v-form
          id="requestForm"
          @submit="validate"
          action=""
          method="post"
        >-->
        <v-window v-model="step">

            <v-window-item :value="1">
                <v-card-text>
                    <v-row>
                        <v-col>
                            <v-text-field color="#003366" outlined label="Legal Surname"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field color="#003366" outlined label="Legal First Given Name(s)"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field color="#003366" outlined label="Legal Second (Middle) Given Name(s)"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field color="#003366" outlined  hint="If different from legal surname" label="Usual Surname"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field color="#003366" outlined  hint="If different from legal first given name" label="Usual First Given Name"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field color="#003366" outlined  hint="If different from legal second given name" label="Usual Second (Middle) Given Name(s)"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field color="#003366"  hint="Optional" outlined label="Maiden Name"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field color="#003366" hint="Optional"  outlined label="Past Name(s)"></v-text-field>
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
                                  ></v-text-field>
                              </template>
                              <v-date-picker
                                color="#003366"
                                ref="picker"
                                v-model="date"
                                :max="new Date().toISOString().substr(0, 10)"
                                min="1903-01-01"
                                @change="save"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-select color="#003366" outlined :items="genders" label="Gender"></v-select>
                      </v-col>
                      <v-col>
                        <v-select color="#003366" outlined :items="sexes" label="Sex"></v-select>
                      </v-col>
                    </v-row>
                </v-card-text>
            </v-window-item>

            <v-window-item :value=2>
                <v-card-text>
                    <v-row>
                        <v-text-field color="#003366" hint="Optional"  outlined label="School Student ID Number"></v-text-field>
                    </v-row>
                    <v-row>
                        <v-text-field color="#003366" outlined label="Last BC School Attended"></v-text-field>
                    </v-row>
                    <v-row>
                        <v-text-field color="#003366" outlined label="Current School Attending"></v-text-field>
                    </v-row>
                </v-card-text>
            </v-window-item>

            <v-window-item :value=3>
                <v-card-text>
                    <v-row>
                        <v-col>
                            <v-text-field color="#003366" outlined label="E-mail Address"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field color="#003366" outlined label="Primary Mailing Address"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field color="#003366" hint="Optional"  outlined label="Secondary Mailing Address"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field color="#003366" outlined label="City"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field color="#003366" outlined label="Province/State"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                          <v-autocomplete
                            v-model="model"
                            :items="countries"
                            :loading="isLoading"
                            :search-input.sync="search"
                            color="#003366"
                            hide-selected
                            hide-no-data
                            outlined
                            item-text="Name"
                            item-value="alpha3Code"
                            label="Country"
                            return-object
                          >
                          </v-autocomplete>
                        </v-col>
                        <v-col>
                            <v-text-field color="#003366" outlined label="Postal Code"></v-text-field>
                        </v-col>
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
                v-if="step !== 3"
                color="#003366"
                dark
                depressed
                @click="step++"
            >
            Next
            </v-btn>
            <v-btn
              v-else
              color="#003366"
              dark
              depressed
              @click="submit"
            >
            Submit
            </v-btn>
        </v-card-actions>
       <!-- </v-form> -->
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
      menu: false,
      entries: [],
      isLoading: false,
      model: null,
      search: null,
      nameLimit: 80
    };
  },
  computed: {
    currentSubtitle () {
      switch(this.step){
      case 1: return 'Personal Information';
      case 2: return 'School Information';
      default: return 'Contact Information';
      }
    },
    currentWidth () {
      switch(this.step){
      case 1: return '50%';
      case 2: return '35%';
      default: return '45%';
      }
    },
    fields () {
      if (!this.model) return []

      return Object.keys(this.model).map(key => {
        return {
          key,
          value: this.model[key] || 'n/a',
        }
      })
    },
    countries () {
      return this.entries.map(entry => {
        const Name = entry.name;

        return Object.assign({}, entry, { Name })
      })
    },
  },
  watch: {
    menu (val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    },
    search (val) {
      // Items have already been loaded
      if (this.countries.length > 0) return

      // Items have already been requested
      if (this.isLoading) return

      this.isLoading = true

      // Lazily load input items
      fetch('https://restcountries.eu/rest/v2/all')
        .then(res => res.json())
        .then(res => {
          this.entries = res
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoading = false))
    },
  },
  methods: {
    submit() {

    },
    save (date) {
      this.$refs.menu.save(date)
    },
  },
};
</script>

<style scoped>
.mainCard{
    margin: 20px 0px;
    padding:10px;
}
.v-card-text{
    padding-top: 0px;
    margin-top: 0px;
}
</style>
