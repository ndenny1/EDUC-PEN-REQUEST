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
              <v-col class="justify-start">
                <v-textarea
                    type="text"
                    rows=1
                    auto-grow
                    v-model.trim="reply" 
                    class="reply--text" 
                    placeholder="Enter a message and hit the Reply button"
                    maxlength="4000"
                    required
                    :disabled="disabled"
                />
                <v-chip
                  class="ma-1"
                  close
                  close-icon="fa-chevron-down"
                  color="indigo darken-3"
                  label
                  outlined
                >
                  passport.pdf
                </v-chip>
                <v-menu
                  v-model="menu"
                  bottom
                  right
                  transition="scale-transition"
                  origin="top left"
                >
                  <template v-slot:activator="{ on }">
                    <v-chip
                      class="ma-1"
                      close
                      close-icon="fa-chevron-down"
                      color="indigo darken-3"
                      label
                      outlined
                      v-on="on"
                      @click:close="menu = true"
                    >
                      driver-license.jpeg
                    </v-chip>
                  </template>
                    <v-card width="350">
                      <v-list>
                        <!-- <v-list-item>
                            <v-row>
                          <v-col cols="12" xl="4" lg="4" md="4" sm="4">
                            <p class="mb-1">Type:</p>
                          </v-col>
                          <v-col cols="12" xl="8" lg="8" md="8" sm="8">
                            <p class="mb-1"><strong>Canadian Driver License</strong></p>
                          </v-col>
                            </v-row>
                        </v-list-item>
                        <v-list-item>
                            <v-row>
                          <v-col cols="12" xl="4" lg="4" md="4" sm="4">
                            <p class="mb-1">File Name:</p>
                          </v-col>
                          <v-col cols="12" xl="8" lg="8" md="8" sm="8">
                            <p class="mb-1"><strong>driver-license.jpeg</strong></p>
                          </v-col>
                            </v-row>
                        </v-list-item>
                        <v-list-item>
                            <v-row>
                          <v-col cols="12" xl="4" lg="4" md="4" sm="4">
                            <p class="mb-1">Upload Date/time:</p>
                          </v-col>
                          <v-col cols="12" xl="8" lg="8" md="8" sm="8">
                            <p class="mb-1"><strong>2020-03-02 12:23:24</strong></p>
                          </v-col>
                            </v-row>
                        </v-list-item>
                        <v-list-item>
                            <v-row>
                          <v-col cols="12" xl="4" lg="4" md="4" sm="4">
                            <p class="mb-1">Size:</p>
                          </v-col>
                          <v-col cols="12" xl="8" lg="8" md="8" sm="8">
                            <p class="mb-1"><strong>134 KB</strong></p>
                          </v-col>
                            </v-row>
                        </v-list-item> -->

                        <v-list-item>
                          <v-list-item-avatar>
                            <v-icon>fa-id-card</v-icon>
                          </v-list-item-avatar>

                          <v-list-item-content>
                            <v-list-item-title>Canadian Driver License</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-avatar>
                            <v-icon>fa-file</v-icon>
                          </v-list-item-avatar>

                          <v-list-item-content>
                            <v-list-item-title>driver-license.jpeg</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-avatar>
                            <v-icon>fa-hdd</v-icon>
                          </v-list-item-avatar>

                          <v-list-item-content>
                            <v-list-item-title>134 KB</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-avatar>
                            <v-icon>fa-clock</v-icon>
                          </v-list-item-avatar>

                          <v-list-item-content>
                            <v-list-item-title>2020-03-02 12:23:24</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>

                        <!-- <v-list-item>
                          <v-list-item-avatar>
                            <v-icon>fa-id-card</v-icon>
                          </v-list-item-avatar>

                          <v-list-item-content>
                            <v-list-item-title>Canadian Driver License</v-list-item-title>
                            <v-list-item-subtitle class="mt-2">driver-license.jpeg</v-list-item-subtitle>
                            <v-list-item-subtitle class="mt-2">134 KB</v-list-item-subtitle>
                            <v-list-item-subtitle class="mt-2">2020-03-02 12:23:24</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item> -->
                      </v-list>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                          <v-btn color="#003366" @click="menu = false" class="white--text">Delete</v-btn>
                          <v-btn color="#003366" @click="menu = false" class="white--text">Cancel</v-btn>
                        </v-card-actions>
                    </v-card>
                  </v-menu>
                <v-chip 
                  class="ma-1"
                  color="#003366"
                  label
                  outlined
                >
                  <v-icon left>fa-paperclip</v-icon>
                </v-chip>
              </v-col>
              <v-btn 
                  :disabled="replyEmpty"
                  color="#003366"
                  dark
                  class="reply--button" 
                  @click="submitComment"
                  :loading="submitting"
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
  components: {
    singleComment
  },
  props: {
    comments_wrapper_classes: {
      type: Array,
      required: true
    }, 
    myself: {
      type: Object,
      required: true
    }, 
    messages: {
      type: Array,
      required: true
    },
    participants: {
      type: Array,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
  },
  data: function() {
    return {
      reply: '',
      submitting: false,
      menu: false,
    };
  },
  computed: {
    iconSize() {
      switch (this.$vuetify.breakpoint.name) {
      case 'xs': return '30px';
      case 'sm': return '35px';
      case 'md': return '37px';
      case 'lg': return '40px';
      case 'xl': return '50px';
      default: return '50px';
      }
    },
    replyEmpty(){
      return this.reply === '';
    }
  },
  methods: {
    replied() {
      this.submitting = false;
    },
    //Tell the parent component(main app) that we have a new comment
    submitComment: function() {
      if(this.reply.comment !== '') {
        const timestamp = LocalDateTime.now().toString();
        const messageToSend = {
          timestamp: timestamp,
          content: this.reply,
          myself: true,
          participantId: 1
        };
        this.submitting = true;
        this.$emit('submit-comment', {
          message: messageToSend,
          replied: this.replied
        });
        this.reply = '';
      }
    },
  },
};
</script>

<style scoped>
.comments {
    max-height: 100%;
    height: 100%;
    width: 100%;
    bottom: 0;
    position: relative
}
.comments-wrapper {
    overflow-y: auto;
    overflow-x: hidden;
    padding-bottom: 0;
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
    /* border-radius: 30px; */
    margin: 1rem;
    padding-right: 1rem;
    padding-left: 1rem;
    /* width: 90%; */
    overflow: hidden;
}
.reply .avatar {
    position: absolute;
}
.reply .reply--text {
    min-height: 40px;
    padding: 0.3rem 0;
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
    position: relative;
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

.v-textarea /deep/ .v-messages {
  min-height: fit-content !important;
}

.v-textarea /deep/ .v-text-field__details {
  min-height: fit-content !important;
}

.v-list-item__avatar:first-child

.document-label {
  margin-right: 10px;
}

.document-label h3 {
  line-height: 1.2;
  font-size: 0.875rem;
}

</style>
