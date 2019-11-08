<template>
    <v-card>
        <v-list-item>
            <v-list-item-content>
                <v-list-item-title><h3>PEN Request Form</h3></v-list-item-title>
                <v-list-item-subtitle>Complete this form to request your PEN</v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>

        <v-card-text>
                <v-row>
                    <v-col>
                        <v-text-field outlined label="Legal Surname"></v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field outlined label="Legal First Given Name(s)"></v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field outlined label="Legal Second (Middle) Given Name(s)"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-text-field outlined label="Usual Surname"></v-text-field>
                    </v-col>
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
                    <v-col>
                        <v-text-field outlined label="School Student ID Number"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-text-field outlined label="Last BC School Attended"></v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field outlined label="Current School Attending"></v-text-field>
                    </v-col>
                </v-row>
        </v-card-text>

        <v-card-actions>
            <v-btn dark large color="#003366">Submit</v-btn>
            <v-btn dark large color="#003366">Clear</v-btn>
        </v-card-actions>
    </v-card>        
</template>

<script>
export default {
    data() {
        return {
            genders: ['Male', 'Female', 'Other']
        }
    },
};
</script>

<style scoped>
.v-card{
    margin: 10px 0px;
    padding:10px;
    width: 75%;
    min-width: 600px;
}
.v-card-text{
    padding-top: 0px;
    margin-top: 0px;
}
</style>
