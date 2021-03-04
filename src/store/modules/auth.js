import api from "../../api/castellers";

// initial state
const state = () => ({
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
});

// getters
const getters = {
  refreshToken: state => state.auth.refreshToken,
  accessToken: state => state.auth.accessToken,
  accessTokenData: (state, getters) =>
    getters.accessToken
      ? JSON.parse(atob(getters.accessToken.split(".")[1]))
      : null,
  refreshTokenData: (state, getters) =>
    getters.accessToken
      ? JSON.parse(atob(getters.refreshToken.split(".")[1]))
      : null,

  uuid: (state, getters) => {
    return getters.accessTokenData ? getters.accessTokenData.user_uuid : null;
  },
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
  action: state => state.action,
  isLoggedIn: (state, getters) => {
    if (
      getters.refreshTokenData &&
      getters.refreshTokenData.exp > Date.now() / 1000
    ) {
      return true;
    }
    return false;
  }
};

// actions
const actions = {
  async login(context, { username, password }) {
    return api.login(username, password).then(async function(response) {
      context.commit("authenticate", response.data);
      response = await context.dispatch("members/getMember");
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
  logout(context) {
    context.dispatch("reset");
  }
};

// mutations
const mutations = {
  authenticate(state, payload) {
    state.auth.accessToken = payload.access_token;
    state.auth.refreshToken = payload.refresh_token;
  },
  reset(state) {
    state.auth.accessToken = "";
    state.auth.refreshToken = "";
    state.action = {};
    state.local = "";
  },
  setAction(state, payload) {
    state.action.type = payload.type;
    state.action.objectUUID = payload.objectUUID;
    state.action.payload = payload.payload;
  },
  setLanguage(state, locale) {
    state.locale = locale;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
