import api from "../../api/castellers";

// initial state
const state = () => ({
  auth: {
    accessToken: "",
    refreshToken: "",
  },
  action: {
    type: "",
    objectUUID: "",
    payload: "",
  },
  locale: "",
  // Whether the member is a musician of the colla, as read on their profile.
  musician: false,
});

// getters
const getters = {
  refreshToken: (state) => state.auth.refreshToken,
  accessToken: (state) => state.auth.accessToken,
  accessTokenData: (state, getters) =>
    getters.accessToken
      ? JSON.parse(atob(getters.accessToken.split(".")[1]))
      : null,
  refreshTokenData: (state, getters) =>
    getters.refreshToken
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
  language: (state) => state.locale,
  musician: (state) => state.musician === true,
  action: (state) => state.action,
  isLoggedIn: (state, getters) => {
    if (
      getters.refreshTokenData &&
      getters.refreshTokenData.exp > Date.now() / 1000
    ) {
      return true;
    }
    return false;
  },
};

// actions
const actions = {
  async login(context, { username, password }) {
    return api.login(username, password).then(async function (response) {
      context.commit("authenticate", response.data);
      response = await context.dispatch(
        "members/getMember",
        context.getters.uuid
      );
      context.commit("setLanguage", response.data.language);
      context.commit("setMusician", response.data.musician === 1);
    });
  },
  // Reads again whether the member is a musician: an admin may have changed
  // it since the login. Resolves to true when it changed.
  async refreshMusician(context) {
    if (!context.getters.uuid) {
      return false;
    }
    const before = context.getters.musician;
    const response = await context.dispatch(
      "members/getMember",
      context.getters.uuid
    );
    context.commit("setMusician", response.data.musician === 1);
    return context.getters.musician !== before;
  },
  async refreshToken(context) {
    return api
      .refreshToken(context.getters.refreshToken)
      .then(function (response) {
        context.commit("authenticate", response.data);
        return response;
      });
  },
  async logout(context) {
    // Clear the local session first, so that concurrent logouts (or a login
    // happening meanwhile) are not affected by the API call.
    const accessToken = context.getters.accessToken;
    await context.dispatch("reset");
    await api.logout(accessToken);
  },
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
    state.locale = "";
    state.musician = false;
  },
  setAction(state, payload) {
    state.action.type = payload.type;
    state.action.objectUUID = payload.objectUUID;
    state.action.payload = payload.payload;
  },
  setLanguage(state, locale) {
    state.locale = locale;
  },
  setMusician(state, musician) {
    state.musician = musician;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
