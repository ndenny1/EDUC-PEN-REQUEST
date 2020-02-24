<template>
    <div :class="commentObject.color">
          <v-row class="header-row">
            <v-col class="header-col " md="auto">
              <v-avatar size="48">
                  <v-icon large>{{ commentObject.icon }}</v-icon>
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
      console.log(d);
      let amPm = 'AM';
      let hours = d.hour;
      if(d.hour > 12){
        amPm = 'PM';
        hours = d.hour - 12;
      }
      if(d.minute < 10){
        d.minute = "0" + d.minute;
      }

      const readableTime = d.dayOfWeek + ' ' +  d.month + ' ' + d.day + ', ' + d.year + ' ' + hours + ':' + d.minute + ' ' + amPm;
      if(this.comment.myself){
        return {
          name: this.myself.name,
          content: this.comment.content,
          timestamp: readableTime,
          color: 'studentGreen',
          icon: '$info'
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
          color: 'adminBlue',
          icon: '$question'
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
.studentGreen{
  background-color: #e2efd9;
  padding: 0.7rem;
  margin-bottom: 0.5rem;
  align-items: center;
  color: #333;
  border-radius: 30px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
}
.adminBlue{
  background-color: #deeaf6;
  padding: 0.7rem;
  margin-bottom: 0.4rem;
  align-items: center;
  color: #333;
  border-radius: 30px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
}
</style>
