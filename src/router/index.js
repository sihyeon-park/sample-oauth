/* eslint-disable */
import VueRouter from "vue-router";

import SignIn from "@/views/SignIn.vue";

const routes = [
  {
    path: "/",
    component: SignIn,
    name: "SignIn",
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
