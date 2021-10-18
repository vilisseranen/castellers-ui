import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import createPersistedState from "vuex-persistedstate";
import events from "./modules/events";
import members from "./modules/members";
import castells from "./modules/castells";
import auth from "./modules/auth";
import initialization from "./modules/initialization";
import api from "../api/castellers";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    events,
    members,
    castells,
    auth,
    initialization,
  },
  state: {
    version: "",
  },
  mutations: {
    setVersion(state, version) {
      state.version = version.version;
    },
  },
  actions: {
    async reset(context) {
      context.commit("members/reset");
      context.commit("events/reset");
      context.commit("reset");
    },
    async version(context) {
      return api
        .version()
        .then(function (response) {
          context.commit("setVersion", response.data);
          return response;
        })
        .catch(function (response) {});
    },
  },
  getters: {},
  plugins: [
    createPersistedState({
      paths: ["auth", "events.events", "members.members"],
    }),
  ],
});

axios.defaults.headers.common.Authorization = `Bearer: ${store.getters.accessToken}`;

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 403) {
      store
        .dispatch("refreshToken")
        .then(function (response) {
          // Replace Bearer token from original request
          originalRequest.headers.Authorization = `Bearer: ${response.data.access_token}`;
          return axios(originalRequest);
        })
        .catch(function (response) {
          store.dispatch("logout");

          return Promise.reject(error);
        });
    }
    return Promise.reject(error);
  }
);

export default store;
