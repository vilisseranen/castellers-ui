import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import createPersistedState from "vuex-persistedstate";
import api2 from "./api/castellers";

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
      return api2.getRoles();
    },
    async editMember(context, member) {
      if (member.uuid !== undefined) {
        if (context.getters.type === "member") {
          return api2.editMemberAsMember(member);
        }
        return api2.editMemberAsAdmin(context.getters.uuid, member);
      }
      return api2.editMemberAsAdmin(context.getters.uuid, member);
    },
    async getMember(context, memberUuid) {
      if (context.getters.type === "admin") {
        console.log(memberUuid);
        return api2.getMemberAsAdmin(context.getters.uuid, memberUuid);
      } else {
        return api2
          .getMemberAsMember(context.getters.uuid)
          .then(function(response) {
            context.commit("setLanguage", response.data.language);
          });
      }
    },
    async getMembers(context) {
      return api2.getMembersAsAdmin(context.getters.uuid);
    },
    async getEvent(context, uuid) {
      return api2.getEvent(uuid);
    },
    async editEvent(context, event) {
      if (event.uuid !== undefined) {
        return api2.editEvent(event);
      } else {
        return api2.createEvent(event);
      }
    },
    async presenceEvent(context, { eventUuid, memberUuid, presence }) {
      return api2.presenceEvent(
        context.getters.uuid,
        eventUuid,
        memberUuid,
        presence
      );
    },
    async participateEvent(context, { eventUuid, participation }) {
      return api2.participateEvent(
        context.getters.uuid,
        eventUuid,
        participation
      );
    },
    async getEvents(context) {
      const uuid = context.getters.uuid;
      const type = context.getters.type;
      if (uuid && type) {
        return api2.getEventsAsAdmin(uuid);
      } else if (uuid) {
        return api2.getEventsAsMember(uuid);
      } else {
        return api2.getEventsAsGuest();
      }
    },
    async getEventParticipation(context, eventUuid) {
      const adminUuid = context.getters.uuid;
      return api2.getEventParticipationAsAdmin(adminUuid, eventUuid);
    },
    async login(context, { username, password }) {
      return api2.login(username, password).then(function(response) {
        context.commit("authenticate", response.data);
        context.dispatch("getMember");
      });
    },
    async refreshToken(context) {
      return api2
        .refreshToken(context.getters.refreshToken)
        .then(function(response) {
          context.commit("authenticate", response.data);
          return response;
        });
    },
    async getInitialize() {
      return api2.getInitialize();
    },
    async initialize(context, { payload }) {
      return api2.initialize(payload);
    },
    async resendEmail(context, userUuid) {
      return api2.resendEmailAsAdmin(context.getters.uuid, userUuid);
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
