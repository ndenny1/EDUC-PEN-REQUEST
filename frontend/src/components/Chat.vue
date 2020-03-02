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
          :load-more-messages="toLoad.length > 0 ? loadMoreMessages : null"
          @submit-comment="submitComment"
          :disabled="hideInput"
      ></comments>
  </div>
  </v-card>
</template>
<script>
import comments from './Comment.vue';
import ApiService from '@/common/apiService';
import {mapGetters} from 'vuex'; 

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
    request() {
      return this.penRequest;
    },
    myself() {
      return {name: this.userInfo.displayName, id: '1'};
    },
  },
  created() {
    ApiService.getCommentList(this.request.penRequestID).then(response => {
      this.participants = response.data.participants;
      this.messages = response.data.messages;
      /*this.messages.forEach(element => {
        const dateObj = new Date(element.timestamp.year, element.timestamp.month - 1, element.timestamp.day, element.timestamp.hour, element.timestamp.minute, element.timestamp.second);
        element.timestamp = dateObj;
      });*/
      // this.messages.sort(function(a,b){
      //   return a.timestamp.compareTo(b.timestamp);
      // });
    }).catch(error => {
      console.log(error);
      this.alert = true;
    }).finally(() => 
      this.loading = false
    );
  },
  methods: {
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
      // const messageObject = {
      //   content: message,
      //   timestamp: new Date()
      // };
      // this.messages.push(message);
      ApiService.postComment(this.request.penRequestID, message)
        .then(() => {
          let minute =  message.timestamp.minute();
          if(message.timestamp.minute() < 10){
            minute = '0' + message.timestamp.minute();
          }
          message.timestamp = {
            year: message.timestamp.year(),
            month: message.timestamp.month().name(),// this will show month name as ex:- DECEMBER not value 12.
            day: message.timestamp.dayOfMonth(),
            hour: message.timestamp.hour(),
            minute: minute,
            second: message.timestamp.second(),
            millisecond: message.timestamp.nano(),
            dayOfWeek: message.timestamp.dayOfWeek()
          };
          this.messages.push(message);
        })
        .catch(error => {
          console.log(error);
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
