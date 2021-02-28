import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import createPersistedState from "vuex-persistedstate";
import events from "./modules/events";
import members from "./modules/members";
import auth from "./modules/auth";
import initialization from "./modules/initialization";

Vue.use(Vuex);

var store = new Vuex.Store({
  modules: {
    events,
    members,
    auth,
    initialization
  },
  state: {},
  mutations: {},
  actions: {
    async reset(context) {
      context.commit("members/reset");
      context.commit("events/reset");
      context.commit("reset");
    }
  },
  getters: {},
  plugins: [createPersistedState()]
});

axios.defaults.headers.common.Authorization = `Bearer: ${store.getters.accessToken}`;

axios.interceptors.response.use(
  response => {
    return response;
  },
  async function(error) {
    const originalRequest = error.config;
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      var response = await store.dispatch("refreshToken");
      // Replace Bearer token from original request
      originalRequest.headers.Authorization = `Bearer: ${response.data.access_token}`;
      return axios(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default store;
