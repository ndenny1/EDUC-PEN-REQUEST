<template>
    <div class="comments">
        <div :class="comments_wrapper_classes">
            <singleComment 
                v-for="comment in messages"
                :comment="comment"
                :myself="myself"
                :participants="participants"
                :key="comment.id"
            ></singleComment>
        </div>
        <div class="bottomBar">
            <hr>
            <div class="reply">
                <!-- <div class="avatar">
                    <v-avatar>
                         <v-icon :size="iconSize">$info2</v-icon>
                    </v-avatar>
                </div> -->
                <v-textarea
                    type="text"
                    rows=1
                    auto-grow
                    v-model.trim="reply" 
                    class="reply--text" 
                    placeholder="Enter a message and hit the Reply button"
                    maxlength="4000"
                    required
                    @keyup.enter="submitComment"
                />
                <v-btn 
                    :disabled="replyEmpty"
                    color="#003366"
                    dark
                    class="reply--button" 
                >
                    Reply
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script>
import singleComment from './Single-comment.vue';
import {LocalDateTime} from '@js-joda/core';
export default {
  computed: {
      iconSize() {
      switch (this.$vuetify.breakpoint.name) {
          case 'xs': return '30px'
          case 'sm': return '35px'
          case 'md': return '37px'
          case 'lg': return '40px'
          case 'xl': return '50px'
        }
    },
    replyEmpty(){
        return this.reply === '';
    }
  },
  components: {
    singleComment
  },
  data: function() {
    return {
      reply: ''
    };
  },
  methods: {
    //Tell the parent component(main app) that we have a new comment
    submitComment: function() {
      if(this.reply.comment !== '') {
        const timestamp = LocalDateTime.now();
        // if(timestamp.length > 23){
        //     timestamp = timestamp.substring(0, 23);
        // }
        const messageToSend = {
          timestamp: timestamp,
          content: this.reply,
          myself: true,
          participantId: 1
        };
        this.$emit('submit-comment', messageToSend);
        this.reply = '';
      }
    }
  },
  //What the component expects as parameters
  props: ['comments_wrapper_classes', 'myself', 'messages', 'participants']
};
</script>

<style scoped>
.comments {
    max-height: 100%;
    height: 100%;
    width: 100%;
    position: relative
}
.comments-wrapper {
    overflow-y: auto;
    overflow-x: hidden;
    padding-bottom: 0;
    margin-bottom: 0;
    max-height: 35rem
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
    width: 8px;
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
/* Reply component */
.reply {
    display: flex;
    position: relative;
    align-items: center;
    background-color: #EBEBEB;
    border-radius: 30px;
    margin: 1rem;
    padding-right: 1rem;
    padding-left: 1rem;
    width: 90%;
    overflow: hidden;
}
.reply .avatar {
    position: absolute;
}
.reply .reply--text {
    min-height: 40px;
    padding: 0.3rem 0.7rem;
    border: 0;
    color: #333;
    width: 100%;
    outline: 0;
    background-color: transparent;
    box-shadow: none;
}
.reply input.reply--text:valid {
    margin-right: 4rem;
}
.reply input.reply--text:valid + .reply--button {
    right: 1rem;
}
.reply .reply--button {
    border: 1px solid #2a629c;
    background-color: #003366;
    color: #fff;
    display: inline-block;
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: 30px;
    transition: color 0.25s ease-in-out, background-color 0.25s ease-in-out, border-color 0.25s ease-in-out, box-shadow 0.25s ease-in-out, right 0.25s ease-in-out;
    outline: 0;
}
.reply .reply--button:hover {
    color: #fff;
    background-color: #003366;
}
.reply .reply--button:focus,
.reply .reply--button:active {
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
hr {
    margin-bottom: 1rem;
}
.bottomBar{
    bottom: 0;
    width: 100%;
}

.v-text-field{
    margin-top: 0;
}
.v-textarea textarea{
    padding: 0;
}

.theme--dark.v-btn.v-btn--disabled{
    color: #cdbbbb !important;
}

.v-messages{
    min-height: 0 !important;
}
.v-text-field__details{
    min-height: 0 !important;
}

</style>
