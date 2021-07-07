import api from "../../api/castellers";

// initial state
const state = () => ({
  types: [],
  models: [],
  currentCastell: {
    positions: {}
  }
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
  async getCastellModels(context) {
    return api.getCastellModels().then(function (response) {
      context.commit("setCastellsModels", response.data);
      return response;
    });
  },
  async getCastellModel(context, uuid) {
    return api.getCastellModel(uuid).then(function (response) {
      context.commit("setCastellModel", response.data);
      return response;
    });
  },
  async editCastellModel(context, model) {
    if (model.uuid === undefined) {
      return api.createCastellModel(model).then(function (response) {
        context.commit("setCastellModel", response.data);
        return response;
      });
    } else {
      return api.updateCastellModel(model).then(function (response) {
        context.commit("setCastellModel", response.data);
        return response;
      });
    }
  },
  async deleteCastellModel(context, uuid) {
    return api.deleteCastellModel(uuid);
  }
};

// mutations
const mutations = {
  setCastellsTypeList(state, list) {
    state.types = list;
  },
  setCastellTypePositions(state, positions) {
    state.currentCastell.positions = positions;
  },
  setCastellsModels(state, list) {
    state.models = list;
  },
  setCastellModel(state, model) {
    state.currentCastell = model;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
