import Vue from "vue";
import VueMaterial from "vue-material";
import "vue-material/dist/vue-material.min.css";
import VueRouter from "vue-router";
import "normalize.css";
import "./style-2.scss";
import "./style.css";
import RouterVue from './vue/router.vue';

Vue.use(VueMaterial);
Vue.use(VueRouter);

const routes = [
  {
    path: "/call/:id",
    name: "call",
    component: () => import("./vue/call.vue"),
    props: true
  },
  {
    path: "/",
    name: "home",
    component: () => import("./vue/home.vue")
  }
];

const router = new VueRouter({ mode: 'hash', routes });

new Vue({
  router,
  render: (h) => h(RouterVue),
}).$mount("#root");
