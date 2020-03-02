<template>
    <div :class="commentObject.color">
          <v-row class="header-row">
            <!-- <v-col class="header-col iconCol" md="auto">
              <v-avatar size="48">
                  <v-icon :size="iconSize">{{ commentObject.icon }}</v-icon>
              </v-avatar>
            </v-col> -->
            <v-col class="header-col">
              <p class="username" href="#">
                  <!-- {{ commentObject.name }} on -->
              <!-- </p>
              <p class="timestamp"> -->
                On {{ commentObject.timestamp}},
                <strong>{{ commentObject.name }}</strong> said:
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
      // if(d.minute < 10){
      //   d.minute = "0" + d.minute;
      // }

      // d.dayOfWeek = d.dayOfWeek.toLower();


      // d.month = d.month.pascalCase();
      d.month = d.month.substring(0, 3);
      const readableTime = d.month + ' ' + d.day + ', ' + d.year + ' ' + hours + ':' + d.minute + ' ' + amPm;
      if(this.comment.myself){
        return {
          name: 'You',
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
          name: 'PEN Admin',
          content: this.comment.content,
          timestamp: readableTime,
          color: 'adminBlue',
          icon: '$question'
        };
      }
    },
    iconSize() {
      switch (this.$vuetify.breakpoint.name) {
      case 'xs': return '30px';
      case 'sm': return '35px';
      case 'md': return '37px';
      case 'lg': return '40px';
      case 'xl': return '50px';
      }
    }
  },
  props: ['comment', 'myself', 'participants'],
  mounted() {

  },
  methods: {
    toPascal(str){
      return str.replace(/\w\S*/g, m => m.charAt(0).toUpperCase() + m.substr(1).toLowerCase());
    }
  }
};
</script>

<style scoped>
.comment .avatar {
    align-self: flex-start;
}
.comment .avatar > img {
    width: 3rem;
    height: 3rem;
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
  padding-left: 0.5rem;
  font-size: 0.7rem;
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
  align-items: center;
  color: #333;
  border-bottom: 1px solid #97888e;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
}
.adminBlue{
  background-color: #deeaf6;
  padding: 0.7rem;

  align-items: center;
  color: #333;
  border-bottom: 1px solid #97888e;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
}
.iconCol{
  flex-grow: 0
}
</style>
