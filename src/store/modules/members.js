import api from "../../api/castellers";

// initial state
const state = () => ({});

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
        return api.editMemberAsMember(member);
      }
      return api.editMemberAsAdmin(context.rootGetters.uuid, member);
    }
    return api.createMemberAsAdmin(context.rootGetters.uuid, member);
  },
  async getMember(context, memberUuid) {
    if (context.rootGetters.type === "admin" && memberUuid != null) {
      return api.getMemberAsAdmin(context.rootGetters.uuid, memberUuid);
    } else {
      return api.getMemberAsMember(context.rootGetters.uuid);
    }
  },
  async getMembers(context) {
    return api.getMembersAsAdmin(context.rootGetters.uuid);
  },
  async resendEmail(context, userUuid) {
    return api.resendEmailAsAdmin(context.rootGetters.uuid, userUuid);
  },
  async resetPassword(context, { username, password, token }) {
    return api.resetPassword(username, password, token);
  },
  async forgotPassword(context, email) {
    return api.forgotPassword(email);
  },
  async changePassword(context, password) {
    return api.changePassword(context.rootGetters.uuid, password);
  }
};

// mutations
const mutations = {
  reset(state) {}
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
