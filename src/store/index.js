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

let refreshTokenPromise;

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    if (error.config && error.response && error.response.status === 403) {
      if (!refreshTokenPromise) {
        refreshTokenPromise = store
          .dispatch("refreshToken")
          .then((response) => {
            refreshTokenPromise = null;
            return response.data.access_token;
          });
      }
      return refreshTokenPromise.then((token) => {
        error.config.headers.Authorization = `Bearer: ${token}`;
        return axios.request(error.config);
      });
    }
    return Promise.reject(error);
  }
);

export default store;
