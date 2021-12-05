import api from "../../api/castellers";

// initial state
const state = () => ({
  members: [],
});

// getters
const getters = {};

// actions
const actions = {
  async getRoles() {
    return api.getRoles();
  },
  async editMember(context, member) {
    if (member.uuid !== undefined) {
      if (context.rootGetters.type === "member") {
        return api.editMember(member);
      }
      return api.editMember(member);
    }
    return api.createMember(member);
  },
  async getMember(context, memberUuid) {
    return api.getMember(memberUuid);
  },
  async getMembers(context, { type, status }) {
    const options = {};
    if (type) {
      options.type = type;
    }
    if (status) {
      options.status = status;
    }
    return api
      .getMembers(options)
      .then(function (response) {
        const members = response.data;
        for (let i = 0; i < members.length; i++) {
          members[i].roles = members[i].roles.join(", ");
        }
        context.commit("setMembers", members);
        return response;
      })
      .catch(function (response) {});
  },
  async resendEmail(context, userUuid) {
    return api.resendEmail(userUuid);
  },
  async resetPassword(context, { username, password, token }) {
    return api.resetPassword(username, password, token);
  },
  async forgotPassword(context, email) {
    return api.forgotPassword(email);
  },
  async changePassword(context, password) {
    return api.changePassword(password);
  },
};

// mutations
const mutations = {
  setMembers(state, members) {
    state.members = members;
  },
  reset(state) {
    state.members = [];
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
