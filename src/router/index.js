/* eslint-disable */
import VueRouter from "vue-router";

import OAuth from "@/views/OAuth.vue";
import SignInWithGoogle from "@/views/SignInWithGoogle.vue";

const routes = [
  {
    path: "/",
    redirect: "/oauth",
  },
  {
    path: "/oauth",
    component: OAuth,
    name: "oauth",
  },
  {
    path: "/sign-in-with-google",
    component: SignInWithGoogle,
    name: "SignInWithGoogle",
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
