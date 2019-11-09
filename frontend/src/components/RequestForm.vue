<template>
    <v-card>
        <v-card-title>PEN Request Form</v-card-title>
        <v-card-subtitle>{{ currentSubtitle }}</v-card-subtitle>

        <v-window v-model="step">

            <v-window-item :value="1">
                <v-card-text>
                    <v-row>
                        <v-col>
                            <v-text-field outlined label="Legal Surname"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field outlined label="Legal First Given Name(s)"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field outlined label="Legal Second (Middle) Given Name(s)"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field outlined label="Usual Surname"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field outlined label="Usual First Given Name"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field outlined label="Usual Second (Middle) Given Name(s)"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field outlined label="Maiden Name"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field outlined label="Past Name(s)"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field outlined label="Birthdate"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-select outlined :items="genders" label="Gender"></v-select>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-window-item>

            <v-window-item :value=2>
                <v-card-text>
                    <v-row>
                        <v-text-field outlined label="School Student ID Number"></v-text-field>
                    </v-row>
                    <v-row>
                        <v-text-field outlined label="Last BC School Attended"></v-text-field>
                    </v-row>
                    <v-row>
                        <v-text-field outlined label="Current School Attending"></v-text-field>
                    </v-row>
                </v-card-text>
            </v-window-item>

            <v-window-item :value=3>
                <v-card-text>
                    <v-row>
                        <v-col>
                            <v-text-field outlined label="E-mail Address"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field outlined label="Primary Mailing Address"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field outlined label="Secondary Mailing Address"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field outlined label="City"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field outlined label="Province"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field outlined label="Postal Code"></v-text-field>
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
                :disabled="step === 3"
                color="#003366"
                dark
                depressed
                @click="step++"
            >
            Next
            </v-btn>
        </v-card-actions>
    </v-card>        
</template>

<script>
export default {
  data() {
    return {
      genders: ['Male', 'Female', 'Other'],
      step: 1
    };
  },
  computed: {
    currentSubtitle () {
      switch(this.step){
      case 1: return 'Personal Information';
      case 2: return 'School Information';
      default: return 'Contact Information';
      }
    }
  },
};
</script>

<style scoped>
.v-card{
    margin: 10px 0px;
    padding:10px;
    width: 50%;
    min-width: 600px;
}
.v-card-text{
    padding-top: 0px;
    margin-top: 0px;
}
</style>
