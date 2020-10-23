<template>
  <div class="md-layout md-alignment-center-center h-full w-full bkg">
    <md-content class="md-layout md-alignment-top-center md-elevation-2 h-420px w-440px">
      <md-content class="video">
        <video class="m-height-330px" ref="video" playsinline muted autoplay></video>
        <span v-if="!joinEnabled" class="md-display-1 text-center w-full block">{{dictionary.ALLOW_CAMERA}}</span>
        <span v-if="joinError" class="md-display-1 text-center w-full block">{{dictionary.CAMERA_DENIED}}</span>
      </md-content>
      <div class="md-layout-item md-size-100"></div>
      <div class="md-layout md-alignment-center-center">
        <md-button :disabled="!joinEnabled" @click="$emit('join', stream)" class="join md-primary md-raised white">
          {{dictionary.ENTER}}
        </md-button>
      </div>
    </md-content>
    <div class="data md-headline md-medium-hide">{{data}}</div>
    <div class="logo">
      <p class="md-display-1 white">Video-call 1 to 1</p>
    </div>
  </div>
</template>

<script>

  import dictionary from '../lang/dictionary.js';

  export default {
    name: "join.vue",
    data() {
      return {
        dictionary: dictionary,
        joinEnabled: false,
        joinError: false
      }
    },
    mounted() {
      const language = (window.navigator.languages || [])[0] || window.navigator.userLanguage || window.navigator.language;
      this.data = new Date().toLocaleDateString(language, {hour: "numeric", minute: "numeric", second: "numeric"});
      setInterval(() => {
        this.data = new Date().toLocaleDateString(language, {hour: "numeric", minute: "numeric", second: "numeric"});
      }, 500);
      navigator.mediaDevices.getUserMedia({audio: true, video: true})
        .catch(err => {
          console.error("Can't access camera: ", err);
          this.joinError = true;
        })
        .then(stream => {
          this.stream = stream;
          this.$refs.video.srcObject = stream;
          this.joinEnabled = true;
        });
    }
  }
</script>

<style lang="scss" scoped>

  .m-height-330px{
    max-height: 330px;
  }

  .h-420px {
    height: 420px;
    max-height: 420px;
    min-height: 420px;
  }

  .w-440px {
    width: 440px;
    max-width: 440px;
    min-width: 440px;
  }

  .data {
    position: absolute;
    top: 25px;
    right: 20px;
    color: #fff;
    font-family: Roboto, sans-serif;
    text-shadow: 0 4px 5px rgba(0, 0, 0, .3)
  }

  .logo {
    position: absolute;
    top: 25px;
    left: 20px;
    width: 400px;
  }

  .white {
    color: white !important;
  }

  @media (max-width: 1200px){
    .logo {
      width: 250px;
    }

    .md-display-1{
      font-size: 24px;
    }
  }
</style>