<template>
    <div class="comment">
          <v-row class="header-row">
            <v-col class="header-col" md="auto">
              <v-avatar :color="commentObject.color">
                  <span class="white--text headline">{{ commentObject.name[0] }}</span>
              </v-avatar>
            </v-col>
            <v-col class="header-col">
              <strong class="username" href="#">
                  {{ commentObject.name }}
              </strong>
              <p class="timestamp">
                {{ commentObject.timestamp}}
              </p>
            </v-col>
        </v-row>
        <v-row>
          <v-col class="content-col">
              <span>{{ commentObject.content }}</span>
          </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
  computed: {
    commentObject() {
      const d = this.comment.timestamp;
      var weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June','July', 'August', 'September', 'October', 'November', 'December'];
      let amPm = 'AM';
      let hours = d.getHours();
      if(d.getHours() > 12){
        amPm = 'PM';
        hours = d.getHours() - 12;
      }

      const readableTime = weekdays[d.getDay()] + ' ' +  monthNames[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear() + ' ' + hours + ':' + d.getMinutes() + ' ' + amPm;
      if(this.comment.myself){
        return {
          name: this.myself.name,
          content: this.comment.content,
          timestamp: readableTime,
          color: '#003366'
        };
      } else {
        let participantName = 'unknown';
        (this.participants).forEach(element => {
          if(this.comment.participantId === element.id){
            participantName = element.name;
          }
        });
        return {
          name: participantName,
          content: this.comment.content,
          timestamp: readableTime,
          color: 'red'
        };
      }
    }
  },
  props: ['comment', 'myself', 'participants'],
  mounted() {

  }
};
</script>

<style scoped>
.comment {
    padding: 0.7rem;
    margin-bottom: 0.7rem;
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
    width: 4rem;
    height: 4rem;
    border-radius: 100%;
    align-self: start;
}
.comment .text {
    text-align: left;
    margin-left: 0.5rem;
}
.comment .text span {
    margin-left: 0.5rem;
}
.comment .text .username {
    font-weight: bold;
    color: #333;
}
.username{
  font-size: 1rem;
}
.timestamp{
  font-size: 0.72rem;
  color: rgba(0, 0, 0, 0.38)
}
.header-row{
  padding-bottom: 0;
}
.header-col{
  padding-top: 0;
  padding-bottom: 0;
}
.content-col{
  padding-left: 2rem;
  padding-bottom: 0.5rem;
  padding-top: 0.5rem;
}
</style>
