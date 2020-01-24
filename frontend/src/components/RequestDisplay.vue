<template>
  <v-container fluid class="full-height">
  <article id="pen-request-container" class="background top-banner full-height">
    <v-row align="center" justify="center">
      <v-card class="mainCard">  
        <v-card-title><h3>PEN Request Data</h3></v-card-title>

        <v-card-text class="noPadding">
          <v-text-field
            v-model="penRequestId"
            append-outer-icon="search"
            label="PEN Request ID"
            single-line
            filled
            @click:append-outer="searchPenRequest"
          ></v-text-field>
          <v-alert
            dense
            text
            dismissible
            v-model="alert"
            type="warning"
          >
            Can't find PEN Request by ID
          </v-alert>

          <v-card class="request-display">
            <v-card-text class="noPadding">
              <v-row>
                <v-col>
                  <v-text-field v-model="penRequest.legalFirstName" color="#003366" label="Legal First Name(s)" readonly></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field v-model="penRequest.legalLastName" color="#003366" label="Legal Last Name" readonly></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field v-model="penRequest.dob" color="#003366" label="DOB" readonly></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field v-model="penRequest.penRequestStatusCode" color="#003366" label="Status" readonly></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>

            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>
                  <v-row>
                    <v-col
                      cols="auto"
                      class="mr-auto"
                    >
                      Documents
                    </v-col>
                    <v-col cols="auto">
                      <v-btn
                        color="#003366"
                        class="white--text"
                        id="submit_form"
                        @click.stop="dialog = true"
                      >
                        New Document
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-list-item-title>
            
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">Type</th>
                        <th class="text-left">File Name</th>
                        <th class="text-left">Size</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in documents" :key="item.fileName">
                        <td>{{ item.documentType}}
                        <td>{{ item.fileName }}</td>
                        <td>{{ item.fileSize }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-list-item-content>
            </v-list-item>
          </v-card>
          <v-container>
           
          </v-container>
        </v-card-text>
      </v-card>
    </v-row>
  </article>

    <v-dialog
      v-model="dialog"
      width="500"
    >
      <DocumentUpload 
        documentOwnerTypeCode="PENRETRIEV" 
        :documentOwnerId="penRequestId"
        @close:form="() => dialog = false">
      </DocumentUpload>
    </v-dialog>

  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import DocumentUpload from './DocumentUpload';

export default {
  name: 'requestDisplay',
  components: {
    DocumentUpload
  },
  data() {
    return {
      alert: false,
      dialog: false,
      penRequestId: null,
      penRequest: {
        legalFirstName: null,
        legalLastName: null,
        dob: null,
        penRequestStatusCode: null
      },
      documents: [
        // {
        //   documentType: 'BC Services Card w Photo',
        //   fileName: 'BCServiceCard.jpg',
        //   fileSize: 159,
        // },
      ],
    };
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated']),
  },
  mounted() {
    if(!(this.isAuthenticated)){
      window.location.href = '/';
    }
  },
  methods: {
    async searchPenRequest() {
      if(this.penRequestId) {
        try {
          const penRequest = await this.$store.dispatch('penRequest/getPenRequest', this.penRequestId);
          console.log('penRequest:' + penRequest);
          if(penRequest) {
            this.penRequest.legalFirstName = penRequest.legalFirstName;
            this.penRequest.legalLastName = penRequest.legalLastName;
            this.penRequest.dob = penRequest.dob.substring(0,10);
            this.penRequest.penRequestStatusCode = penRequest.penRequestStatusCode;
          } else {
            this.alert = true;
          }
        } catch (e) {
          this.alert = true;
        } 
      }
    }
  }
};
</script>

<style scoped>
.container{
  padding: 0px;
  padding-bottom: 50px;
}

.full-height{
  height: 100%;
}

.background{
  background-color: aliceblue;
  min-height: 500px;
  background-size: cover;
  display: flex;
  height: 100%;
  width: 100%;
}

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

.request-display{
  margin: 20px 0px;
  padding: 20px;
}
</style>
