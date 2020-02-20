<template>
    <div class="comments-outside">
      <comments 
          :comments_wrapper_classes="['custom-scrollbar', 'comments-wrapper']"
          :comments="comments"
          :current_user="current_user"
          :myself="myself"
          :messages="messages"
          @submit-comment="submitComment"
      ></comments>
  </div>

</template>
<script>
import comments from './Comment.vue';
import ApiService from '@/common/apiService';
export default {
  components: {
    comments
  },
  props: {
    myself: {
      type: Object,
      required: true
    },
    participants: {
      type: Array,
      required: true
    },
    messages: {
      type: Array,
      required: true
    },
    penRequestID: {
      type: String,
      required: true
    },
    hideInput: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      //Info about the owner of the post
      creator: {
        user: 'owner',
        color: 'red'
      },
      //Some info about the current user
      current_user: {
        user: 'example',
        color: '#003366'
      },
      //Comments that are under the post
      comments: [
        {
          id: 987654321,
          user: 'owner',
          color: 'red',
          text: 'wassup fam'
        },
        {
          id: 123456789,
          user: 'example',
          color: '#003366',
          text: 'lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor',
        },
      ]
    };
  },
  mounted() {
    //console.log(this.messages);
    // console.log(this.myself);
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
    submitComment: function (message) {
      const messageObject = {
        content: message
      };
      ApiService.postComment(this.penRequestID, messageObject)
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
a {
  text-decoration: none;
}
hr {
  display: block;
  height: 1px;
  border: 0;
  border-top: 1px solid #ececec;
  margin: 1em 0;
  padding: 0;
}
.comments-outside {
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  margin: 0 auto;
  max-width: 600px;
  padding-top: 0.5em
}
.comments-header {
  background-color: #C8C8C8;
  padding: 10px;
  align-items: center;
  display: flex;
  justify-content: space-between;
  color: #333;
  min-height: 80px;
  font-size: 20px;
}
.comments-header .comments-stats span {
  margin-left: 10px;
}
.post-owner {
  display: flex;
  align-items: center;
}
.post-owner .avatar > img {
  width: 30px;
  height: 30px;
  border-radius: 100%;
}
.post-owner .username {
  margin-left: 5px;
}
.post-owner .username > a {
  color: #333;
}
</style>
