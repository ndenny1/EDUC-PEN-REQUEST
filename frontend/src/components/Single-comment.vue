<template>
    <div class="comment">
        <div class="avatar">
            <v-avatar :color="commentObject.color">
                <span class="white--text headline">{{ commentObject.name[0] }}</span>
            </v-avatar>
        </div>
        <div class="text">
            <a class="username" href="#">
                {{ commentObject.name }}
            </a> 
            <span>{{ commentObject.content }}</span>
        </div>
    </div>
</template>

<script>
export default {
  computed: {
    commentObject() {
      if(this.comment.myself){
        return {
          name: this.myself.name,
          content: this.comment.content,
          color: '#003366'
        };
      } else {
        return {
          name: this.comment.participantId,
          content: this.comment.content,
          color: 'red'
        }
      }
    }
  },
  props: ['comment', 'myself'],
  mounted() {
      
  }
};
</script>

<style scoped>
.comment {
    display: flex;
    padding: 10px;
    margin-bottom: 10px;
    align-items: center;
    color: #333;
    background-color: #F2F2F2;
    border-radius: 30px;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
}
.comment .avatar {
    align-self: flex-start;
}
.comment .avatar > img {
    width: 40px;
    height: 40px;
    border-radius: 100%;
    align-self: start;
}
.comment .text {
    text-align: left;
    margin-left: 5px;
}
.comment .text span {
    margin-left: 5px;
}
.comment .text .username {
    font-weight: bold;
    color: #333;
}
</style>
