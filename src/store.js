import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import createPersistedState from "vuex-persistedstate";
import api from "./api/castellers";

Vue.use(Vuex);

var store = new Vuex.Store({
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
    async getRoles() {
      return api.getRoles();
    },
    async editMember(context, member) {
      if (member.uuid !== undefined) {
        if (context.getters.type === "member") {
          return api.editMemberAsMember(member);
        }
        return api.editMemberAsAdmin(context.getters.uuid, member);
      }
      return api.editMemberAsAdmin(context.getters.uuid, member);
    },
    async getMember(context, memberUuid) {
      if (context.getters.type === "admin") {
        return api.getMemberAsAdmin(context.getters.uuid, memberUuid);
      } else {
        return api.getMemberAsMember(context.getters.uuid);
      }
    },
    async getMembers(context) {
      return api.getMembersAsAdmin(context.getters.uuid);
    },
    async getEvent(context, uuid) {
      return api.getEvent(uuid);
    },
    async editEvent(context, event) {
      if (event.uuid !== undefined) {
        return api.editEvent(context.getters.uuid, event);
      } else {
        return api.createEvent(context.getters.uuid, event);
      }
    },
    async presenceEvent(context, { eventUuid, memberUuid, presence }) {
      return api.presenceEvent(
        context.getters.uuid,
        eventUuid,
        memberUuid,
        presence
      );
    },
    async participateEvent(context, { eventUuid, participation }) {
      return api.participateEvent(
        context.getters.uuid,
        eventUuid,
        participation
      );
    },
    async getEvents(context) {
      const uuid = context.getters.uuid;
      const type = context.getters.type;
      if (uuid && type === "admin") {
        return api.getEventsAsAdmin(uuid);
      } else if (uuid) {
        return api.getEventsAsMember(uuid);
      } else {
        return api.getEventsAsGuest();
      }
    },
    async getEventParticipation(context, eventUuid) {
      const adminUuid = context.getters.uuid;
      return api.getEventParticipationAsAdmin(adminUuid, eventUuid);
    },
    async login(context, { username, password }) {
      return api.login(username, password).then(async function(response) {
        context.commit("authenticate", response.data);
        response = await context.dispatch("getMember", context.getters.uuid);
        context.commit("setLanguage", response.data.language);
      });
    },
    async refreshToken(context) {
      return api
        .refreshToken(context.getters.refreshToken)
        .then(function(response) {
          context.commit("authenticate", response.data);
          return response;
        });
    },
    async getInitialize() {
      return api.getInitialize();
    },
    async initialize(context, { payload }) {
      return api.initialize(payload);
    },
    async resendEmail(context, userUuid) {
      return api.resendEmailAsAdmin(context.getters.uuid, userUuid);
    },
    async resetPassword(context, { username, password, token }) {
      return api.resetPassword(username, password, token);
    },
    async forgotPassword(context, email) {
      return api.forgotPassword(email);
    },
    async changePassword(context, password) {
      return api.changePassword(context.getters.uuid, password);
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
