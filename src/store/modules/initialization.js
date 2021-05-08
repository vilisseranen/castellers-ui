import api from "../../api/castellers";

// initial state
const state = () => ({});

// getters
const getters = {};

// actions
const actions = {
  async getInitialize() {
    return api.getInitialize();
  },
  async initialize(context, payload) {
    return api.initialize(payload);
  },
};

// mutations
const mutations = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
