<template>
  <v-card height="100%" width="100%">
    <div id="comments-outer" class="comments-outside">
      <v-progress-linear
        indeterminate
        absolute
        top
        color="indigo darken-2"
        v-if="loading"
      ></v-progress-linear>
      <comments 
          :comments_wrapper_classes="['custom-scrollbar', 'comments-wrapper']"
          :myself="myself"
          :participants="participants"
          :messages="messages"
          :unsubmittedDocuments="unsubmittedDocuments"
          @submit-comment="submitComment"
          :disabled="hideInput"
      ></comments>
  </div>
  </v-card>
</template>
<script>
import comments from './Comment.vue';
import ApiService from '@/common/apiService';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import { groupBy, sortBy } from 'lodash';
import { PenRequestStatuses } from '@/utils/constants';

export default {
  components: {
    comments
  },
  props: {
    hideInput: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      participants: [],
      messages: [],
      toLoad: [],
      loading: true,
    };
  },
  computed: {
    ...mapGetters('auth', ['userInfo']),
    ...mapGetters('penRequest', ['penRequest']),
    ...mapGetters('document', ['unsubmittedDocuments']),
    request() {
      return this.penRequest;
    },
    myself() {
      return {name: this.userInfo.displayName, id: '1'};
    },
  },
  created() {
    Promise.all([
      ApiService.getDocumentList(this.request.penRequestID),
      ApiService.getCommentList(this.request.penRequestID),
      this.getDocumentTypeCodes()
    ]).then(([documentRes, commentRes]) => {
      this.participants = commentRes.data.participants;
      this.messages = commentRes.data.messages;
      const myMessages = this.messages.filter(message => message.myself);
      const documents = sortBy(documentRes.data, ['createDate']);

      const documentGroup = groupBy(documents, document => {
        const dates = myMessages.map(message => message.timestamp);
        return dates.findIndex(date => date >= document.createDate);
      });

      myMessages.forEach((message, i) => {
        message.documents = documentGroup[i];
      });

      this.setUnsubmittedDocuments(documentGroup[-1]);

    }).catch(error => {
      console.log(error);
      this.alert = true;
    }).finally(() => 
      this.loading = false
    );
  },
  methods: {
    ...mapActions('document', ['getDocumentTypeCodes']),
    ...mapMutations('document', ['setUnsubmittedDocuments']),
    ...mapMutations('penRequest', ['setPenRequest']),
    /*onType: function (event) {
      //here you can set any behavior
    },*/
    loadMoreMessages(resolve) {
      setTimeout(() => {
        resolve(this.toLoad); //We end the loading state and add the messages
        //Make sure the loaded messages are also added to our local messages copy or they will be lost
        this.messages.unshift(...this.toLoad);
        this.toLoad = [];
      }, 1000);
    },
    submitComment: function ({message, replied}) {
      ApiService.postComment(this.request.penRequestID, message).then( messageRes => {
        const postedMessage = messageRes.data;
        return ApiService.updatePenRequestStatus(this.request.penRequestID, PenRequestStatuses.SUBSREV).then(statusRes => {
          postedMessage.documents = this.unsubmittedDocuments;
          this.messages = [...this.messages, postedMessage];
          this.setUnsubmittedDocuments();
          this.setPenRequest(statusRes.data);
        }).then(() => {
          this.$emit('success-alert', 'Your PEN request has been submitted successfully.');
          window.scrollTo(0,0);
        });
      }).catch(error => {
        console.log(error);
        this.$emit('error-alert', 'Sorry, an unexpected error seems to have occurred. You can click on the reply button again later.');
        window.scrollTo(0,0);
      }).finally(() => replied());
    },
    onClose() {
      this.visible = false;
    }
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
}
hr {
  display: block;
  height: 1px;
  border: 0;
  border-top: 1px solid #ececec;
  margin: 1em;
  padding: 0;
}
.comments-outside {
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  margin-top: 0;
  max-width: 100%;
  height:100%;
  width: 100%;
  position: relative;
  overflow-y: hidden;

}
.comments-header {
  background-color: #C8C8C8;
  padding: 1rem;
  align-items: center;
  display: flex;
  justify-content: space-between;
  color: #333;
  min-height: 80px;
  font-size: 2rem;
}
.comments-header .comments-stats span {
  margin-left: 1rem;
}
.post-owner {
  display: flex;
  align-items: center;
}

.post-owner .username > a {
  color: #333;
}

.custom-scrollbar::-webkit-scrollbar-track
{
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    -moz-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 10px;
    background-color: #fff;
}
.custom-scrollbar::-webkit-scrollbar
{
    width: 0.8rem;
    background-color: #fff;
}
.custom-scrollbar::-webkit-scrollbar-thumb
{
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    -moz-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: #555;
}
</style>
