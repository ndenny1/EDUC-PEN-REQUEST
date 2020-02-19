<template>
  <v-card height="100%" width="100%">
    <v-toolbar flat color="#036" class="white--text">
      <v-toolbar-title>Discussion with PEN Administrator</v-toolbar-title>
    </v-toolbar>
    <div id="chat-box" :class="{hide: hideInput}">
      <Chat
        :participants="participants"
        :myself="myself"
        :messages="messages"
        :on-message-submit="onMessageSubmit"
        :placeholder="placeholder"
        :colors="colors"
        :border-style="borderStyle"
        :hide-close-button="hideCloseButton"
        :close-button-icon-size="closeButtonIconSize"
        :on-close="onClose"
        :submit-icon-size="submitIconSize"
        :load-more-messages="toLoad.length > 0 ? loadMoreMessages : null"
        :async-mode="asyncMode"
        :scroll-bottom="scrollBottom"
        :display-header="displayHeader">
      </Chat>
    </div>
  </v-card>
</template>
<script>
import { mapGetters } from 'vuex';
import { Chat } from 'vue-quick-chat';
import 'vue-quick-chat/dist/vue-quick-chat.css';
//import { Routes } from '@/utils/constants';
import ApiService from '@/common/apiService';

export default {
  components: {
    Chat
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

      visible: true,
      placeholder: 'send your message',
      colors: {
        header: {
          bg: '#38598a',
          text: '#fff'
        },
        message: {
          myself: {
            bg: '#fff',
            text: '#38598a'
          },
          others: {
            bg: '#38598a',
            text: '#fff'
          },
          messagesDisplay: {
            bg: '#fafafa'
          }
        },
        submitIcon: '#036'
      },
      borderStyle: {
        topLeft: '10px',
        topRight: '10px',
        bottomLeft: '10px',
        bottomRight: '10px',
      },
      hideCloseButton: true,
      submitIconSize: '30px',
      closeButtonIconSize: '20px',
      asyncMode: false,
      toLoad: [],
      scrollBottom: {
        messageSent: true,
        messageReceived: true
      },
      displayHeader:false
    };
  },
  computed: {
    ...mapGetters('auth', ['userInfo']),
    request() {
      return this.userInfo.penRequest;
    },
    myself() {
      return ({name: this.userInfo.displayName, id: '1'});
    },
  },
  created() {
    ApiService.getCommentList(this.request.penRequestID).then(response => {
      this.participants = response.data.participants;
      this.messages = response.data.messages;
    }).catch(error => {
      console.log(error);
      this.alert = true;
    });    
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
    onMessageSubmit: function (message) {
      ApiService.postComment(this.request.penRequestID, message)
        .then(() => {
          this.messages.push(message);
        })
        .catch(error => {
          console.log(error);
        });
    },
    onClose() {
      this.visible = false;
    }
  }
};
</script>

<style scoped>
  .hide /deep/ .container-message-manager {
    display: none;
  }

  #chat-box {
    height: 90%;
    min-height: 425px;
    padding-bottom: 8px;
  }
</style>
