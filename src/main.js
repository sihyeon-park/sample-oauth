/* eslint-disable */
import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import { Loading } from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(Loading);

new Vue({
  render: (h) => h(App),
  router,
  store,
}).$mount("#app");
