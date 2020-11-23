import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import Api from "./plugins/api";

Vue.use(Vuex);
Vue.use(Api);

export default new Vuex.Store({
  state: {
    auth: {
      accessToken: "",
      refreshToken: ""
    },
    action: {
      type: "",
      objectUUID: "",
      payload: ""
    },
    locale: ""
  },
  mutations: {
    authenticate(state, payload) {
      console.log("in authenticate");
      console.log(payload);
      state.auth.accessToken = payload.access_token;
      state.auth.refreshToken = payload.refresh_token;
    },
    disconnect(state) {
      state.auth.accessToken = "";
      state.auth.refreshToken = "";
    },
    setAction(state, payload) {
      state.action.type = payload.type;
      state.action.objectUUID = payload.objectUUID;
      state.action.payload = payload.payload;
    },
    setLanguage(state, locale) {
      state.locale = locale;
    }
  },
  actions: {
    async setLanguage(context) {
      await Vue.getMember(
        context.getters.uuid,
        context.getters.accessToken
      ).then(function(response) {
        context.commit("setLanguage", response.data.language);
      });
    }
  },
  getters: {
    refreshToken: state => state.auth.refreshToken,
    accessToken: state => state.auth.accessToken,
    accessTokenData: (state, getters) =>
      getters.accessToken
        ? JSON.parse(atob(getters.accessToken.split(".")[1]))
        : null,
    uuid: (state, getters) =>
      getters.accessTokenData ? getters.accessTokenData.user_uuid : null,
    permissions: (state, getters) =>
      getters.accessTokenData ? getters.accessTokenData.permissions : [],
    type: (state, getters) => {
      if (getters.permissions.includes("admin")) {
        return "admin";
      } else if (getters.permissions.includes("member")) {
        return "member";
      } else {
        return null;
      }
    },
    language: state => state.locale,
    action: state => state.action
  },
  plugins: [createPersistedState()]
});
