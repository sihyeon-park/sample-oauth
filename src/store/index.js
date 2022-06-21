/* eslint-disable */
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    access_token: null,
    refresh_token: null,
    uuid: null,
  },
  getters: {},
  mutations: {
    setAuth(state, { access_token, refresh_token, uuid }) {
      state.access_token = access_token ? access_token : state.access_token;
      state.refresh_token = refresh_token ? refresh_token : state.refresh_token;
      state.uuid = uuid ? uuid : state.uuid;
    },
  },
  actions: {},
  modules: {},
});
