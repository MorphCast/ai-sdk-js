<template>
  <div class="md-layout w-full h-full md-alignment-center-center bkg">
    <form novalidate class="md-layout md-layout-item md-alignment-center-center" @submit.prevent="createCall">
      <md-card class="md-layout-item md-size-30  md-small-size-60 md-xsmall-size-100">
        <md-card-header>
          <div class="md-title">{{dictionary.CREATE_ROOM}}</div>
        </md-card-header>

        <md-card-content>
          <div class="md-layout-item md-small-size-100">
            <md-field>
              <label for="first-name">{{dictionary.USERN_NAME}}</label>
              <md-input name="first-name" id="first-name" autocomplete="given-name" v-model="nome"
                        :disabled="sending"/>
            </md-field>
          </div>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending"/>

        <md-card-actions>
          <md-button type="submit" class="md-primary" :disabled="sending || nome == null">{{dictionary.CONTINUE}}
          </md-button>
        </md-card-actions>
      </md-card>
    </form>
    <div class="data md-headline  md-medium-hide">{{data}}</div>
    <div class="logo">
      <img src="./morphcast_m_logo_white.png" alt="logo">
      <p class="md-display-1 white">Video-call 1 to 1</p>
    </div>

  </div>
</template>

<script>
  import dictionary from '../lang/dictionary.js';

  export default {
    name: "home.vue",
    mounted() {
      const language = (window.navigator.languages || [])[0] || window.navigator.userLanguage || window.navigator.language;
      this.data = new Date().toLocaleDateString(language, {hour: "numeric", minute: "numeric", second: "numeric"});
      setInterval(() => {
        this.data = new Date().toLocaleDateString(language, {hour: "numeric", minute: "numeric", second: "numeric"});
      }, 500);
    },
    data() {
      return {
        data: "",
        dictionary: dictionary,
        nome: null,
        sending: false
      }
    },
    methods: {
      createCall() {
        if (this.nome == null) return;
        const id = 'vidcall-' + this.randomId();
        this.$router.push({name: 'call', params: {id, creator: true, name: this.nome}});
      },
      randomId() {
        return Math.random()
          .toString(36)
          .substr(2, 9)
          .replace(/(...)(...)(...)/, "$1-$2-$3");
      },
    }
  }
</script>

<style scoped>
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

  @media (max-width: 1200px){
    .logo {
      width: 250px;
    }

    .md-display-1{
      font-size: 24px;
    }
  }
</style>