<template>
  <div class="h-full w-full bkg" v-if="!ended">
    <join v-if="!joined && !error" @join="join"></join>
    <div v-show="joined && !error" class="h-full w-full relative">
      <div ref="videowrap" id="videoWrap"
           class="w-full h-full md-layout md-alignment-center-center relative overflow-hidden white md-title">
        <span v-if="creator">{{dictionary.WAITING_CLIENT}}</span>
      </div>
      <div v-if="creator && !csvDownloaded && !wordActive"
           class="wrapper w-500px absolute top-0 left-0 bg-black bg-opacity-50 medium-centered">
        <img ref="gridM" class="w-full" src="./spectrum.png"/>
        <div ref="pin_wrap" class="pin_wrap">
          <div ref="pin" class="pin pulse"></div>
        </div>
      </div>
      <div v-if="creator && !csvDownloaded && wordActive" class="word_wrap"></div>
      <video ref="myVideo" class="absolute top-75 right-0 w-64 md-elevation-3 md-small-hide" playsinline muted
             autoplay></video>
      <div class="data md-headline md-medium-hide">{{data}}</div>
      <div class="md-layout md-alignment-center-center absolute bottom-0 inset-x-0 md-elevation-3 bg-gray-200 h-20">
        <md-button v-if="creator && !csvDownloaded" class="white md-primary my-2 md-raised absolute left-0"
                   @click="endAnalisi">
          {{dictionary.END_DL}}
        </md-button>
        <md-button class="md-icon-button bg-red-600 my-2 md-raised" :class="{'medium-right-0':creator}" @click="end">
          <md-icon class="white">call_end</md-icon>
        </md-button>
      </div>
    </div>
    <md-dialog :md-fullscreen="false" :md-active="showDialog && creator">
      <md-content class="p-top-20">
        <md-content>
          <p class="info">
            {{dictionary.SHARE_URL}}
          </p>
          <p class="url">{{ joinUrl }}</p>
          <md-content class="share_btn" @click="onCopy">
            <md-icon>file_copy</md-icon>
            <span>{{dictionary.SHARE_BTN}}</span>
          </md-content>
        </md-content>
      </md-content>
    </md-dialog>
    <md-snackbar
      :md-position="'left'"
      :md-duration="4000"
      :md-active.sync="showSnackbar"
      md-persistent
    >
      <span>{{dictionary.LINK_COPIED}}</span>
    </md-snackbar>
    <md-dialog-alert
      :md-active.sync="error"
      :md-content="errorMsg"
      md-confirm-text="OK"/>
  </div>
</template>

<script>
  import Join from './join.vue';
  import TwilioHelper from "../twilio-helper";
  import {loadSDK} from '../sdk-loader';
  import Camera from "../camera";
  import EmoMapper from '../emotion_mapper';
  import EmoMapper2 from '../emotion_mapper_word';
  import dictionary from '../lang/dictionary.js';
  import {parseUrl} from '../url_parser';

  export default {
    name: "call.vue",
    components: {Join},
    beforeDestroy() {
      this.end();
    },
    mounted() {
      const language = (window.navigator.languages || [])[0] || window.navigator.userLanguage || window.navigator.language;
      this.data = new Date().toLocaleDateString(language, {hour: "numeric", minute: "numeric", second: "numeric"});
      setInterval(() => {
        this.data = new Date().toLocaleDateString(language, {hour: "numeric", minute: "numeric", second: "numeric"});
      }, 500);
      if (this.roomId == null) {
        this.error = true;
        this.errorMsg = "No RoomId Found";
      }
      if (this.creator) this._em = new EmoMapper();
    },
    data() {
      return {
        wordActive: parseUrl().word,
        data: "",
        dictionary: dictionary,
        errorMsg: "",
        error: false,
        roomId: this.$route.params.id,
        creator: this.$route.params.creator,
        joined: false,
        cmd: {start: e => e, stop: e => e},
        ended: false,
        showSnackbar: false,
        showDialog: true,
        csvDownloaded: false
      }
    },
    computed: {
      joinUrl() {
        return window.location.href;
      }
    },
    methods: {
      onCopy() {
        this.copyToClipboard(this.joinUrl);
        this.showSnackbar = true;
        this.showDialog = false;
      },
      copyToClipboard(str) {
        const el = document.createElement("textarea");
        el.value = str;
        el.setAttribute("readonly", "");
        el.style.position = "absolute";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      },
      onResult(arousalvalence) {
        clearTimeout(this.crtDisableTimeout);
        this.showPin();
        this.setAV(arousalvalence);
        this.crtDisableTimeout = setTimeout(() => this.hidePin(), 3000);
      },
      showPin() {
        if (this.$refs.pin) this.$refs.pin.style.opacity = 0.7;
      },
      hidePin() {
        if (this.$refs.pin) this.$refs.pin.style.opacity = 0;
      },

      setAV({arousal, valence}) {
        let x, y;
        ({x, y} = this.calcCoorinate(arousal, valence));
        this._em.add(x, y);
        if (this.wordActive) this._em2.setEmotions({arousal, valence});
        this.setPinPosition(x, y);
      },
      calcCoorinate(arousal, valence) {
        arousal *= 4;
        valence *= 3;
        let x = Math.max(-1, Math.min(valence, 1));
        let y = Math.max(-1, Math.min(arousal, 1));
        return {x: (x + 1) * 50, y: (y + 1) * 50};
      },
      setPinPosition(x, y) {
        if (this.$refs.pin) {
          this.$refs.pin.style.left = `${x - 2}%`;
          this.$refs.pin.style.bottom = `${y - 2}%`;
        }
      },
      endAnalisi() {
        const rows = this._em.distances;

        let csvContent = "data:text/csv;charset=utf-8,Affect Status;Confidence\n" + rows.map(e => e.join(";")).join("\n");
        csvContent += "\n" + "https://www.semanticscholar.org/paper/Seeing-Stars-of-Valence-and-Arousal-in-Blog-Posts-Paltoglou-Thelwall/6d4fa4b9037b64b8383331583430711be321c587";
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", this.$route.params.name.replace(" ", "_") + ".csv");
        document.body.appendChild(link); // Required for FF
        link.click();

        this.csvDownloaded = true;
      },
      _end() {
        this.ended = true;
        this.cmd.stop();
      },
      end() {
        this.ended = true;
        this.TW.disconnect();
        this.cmd.stop();
        if (this.creator) {
          this.$router.push("/").then(() => {
            location.reload();
          });
        }
      },
      join(stream) {
        this.joined = true;
        this.$refs.myVideo.srcObject = stream;
        this.TW = new TwilioHelper(this.creator ? 'prof' : 'student', this.roomId, () => this._end());
        this.TW.join(stream)
          .then(() => {
            if (this.creator && this.wordActive) this._em2 = new EmoMapper2();
            this.TW.showTrack(this.creator ? 'student' : 'prof', this.$refs.videowrap)
              .then(() => {
                if (!this.creator) {
                  const source = new Camera(this.$refs.videowrap.querySelector("video"));
                  loadSDK().then(CY => {
                    return CY.loader()
                      .source(source)
                      .addModule(CY.modules().FACE_AROUSAL_VALENCE.name)
                      // .licenseKey('<KEY>')
                      .load()
                      .then((cmd) => {
                        this.cmd = cmd;
                        cmd.start();
                        window.addEventListener("CY_FACE_AROUSAL_VALENCE_RESULT", (e) => this.TW.sendData(JSON.stringify(e.detail.output.arousalvalence)));
                      });
                  })
                } else {
                  this.TW.onData(e => this.onResult(JSON.parse(e)));
                }
              });
          });
      }
    }
  }
</script>

<style scoped>

  .top-75 {
    top: 75px;
  }

  .data {
    position: absolute;
    top: 25px;
    right: 20px;
    color: #fff;
    font-family: Roboto, sans-serif;
    text-shadow: 0 4px 5px rgba(0, 0, 0, .3)
  }

  .bg-red-600 {
    --bg-opacity: 1 !important;
    background-color: #e53e3e !important;
    background-color: rgba(229, 62, 62, var(--bg-opacity)) !important;
  }

  .pin_wrap {
    position: absolute;
    top: 6%;
    bottom: 6%;
    left: 12%;
    right: 12%;
    margin: auto;
  }

  .pin {
    width: 4%;
    height: 4%;
    border-radius: 50%;
    color: rgb(255, 255, 255);
    background-color: rgb(255, 255, 255);
    box-shadow: 0 0 10px 10px;
    opacity: 0;
    position: absolute;
    bottom: 48%;
    left: 48%;
    transition: all 0.4s ease-in-out;
  }

  .pulse {
    animation: pulse ease-in-out 1s infinite;
  }

  @keyframes pulse {
    0% {
      -webkit-transform: scale(1);
    }
    51% {
      -webkit-transform: scale(1.2);
    }
    100% {
      -webkit-transform: scale(1);
    }
  }

  .w-500px {
    width: 500px;
    max-width: 100%;
  }

  #videoWrap video {
    min-width: 100%;
    min-height: 100%;
    position: absolute;
    top: -500px;
    bottom: -500px;
    left: -500px;
    right: -500px;
    margin: auto;
  }

  .header {
    overflow: hidden;
    padding: 20px;
  }

  .md-icon-button.right {
    float: right;
  }

  p.info,
  p.url {
    margin-left: 20px;
    margin-right: 20px;
  }

  p.info {
    color: #a1a1a1;
    margin-top: 30px;
  }

  .md-content.share_btn {
    width: 100%;
    padding: 20px;
    cursor: pointer;
  }

  .md-content.share_btn:hover {
    background-color: #e0e0e0;
  }

  .md-content.share_btn:active {
    background-color: #bdbdbd;
  }

  @media (max-width: 1200px) {
    .top-75 {
      top: 0;
    }

    .medium-centered {
      top: 50%;
      transform: translateY(-50%);
    }

    .medium-right-0 {
      right: 0;
      position: absolute;
    }
  }

</style>