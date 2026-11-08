import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import events from "./modules/events";
import members from "./modules/members";
import castells from "./modules/castells";
import auth from "./modules/auth";
import initialization from "./modules/initialization";
import badges from "./modules/badges";
import api from "../api/castellers";

const store = createStore({
  modules: {
    events,
    members,
    castells,
    auth,
    initialization,
    badges,
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
      context.commit("badges/reset");
      context.commit("reset");
    },
    async version(context) {
      return api
        .version()
        .then(function (response) {
          context.commit("setVersion", response.data);
          return response;
        })
        .catch(function () {});
    },
  },
  getters: {},
  plugins: [
    createPersistedState({
      paths: ["auth", "events.events", "members.members"],
    }),
  ],
});

export default store;
