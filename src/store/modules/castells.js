import api from "../../api/castellers";

// initial state
const state = () => ({
  types: [],
  positions: {},
});

// getters
const getters = {};

// actions
const actions = {
  async getCastellsTypeList(context) {
    return api.getCastellsTypeList().then(function (response) {
      context.commit("setCastellsTypeList", response.data);
      return response;
    });
  },
  async getCastellTypePositions(context, type) {
    return api.getCastellTypePositions(type).then(function (response) {
      context.commit("setCastellTypePositions", response.data);
      return response;
    });
  },
};

// mutations
const mutations = {
  setCastellsTypeList(state, list) {
    state.types = list;
  },
  setCastellTypePositions(state, type) {
    state.positions = type;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
