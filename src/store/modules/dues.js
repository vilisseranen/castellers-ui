import api from "../../api/castellers";

// Nothing is kept in the store: the dues are read from the API each time, so
// that two admins working at the same time see each other's changes.

// actions
const actions = {
  async getCollections(context, season) {
    return api.getDuesCollections(season);
  },
  async setCollections(context, { season, collections }) {
    return api.setDuesCollections(season, collections);
  },
  async getMemberDues(context, memberUuid) {
    return api.getMemberDues(memberUuid);
  },
  async getStates(context, season) {
    return api.getDuesStates(season);
  },
  async record(context, { memberUuid, collectionUuids, action, note }) {
    return api.recordDues({ memberUuid, collectionUuids, action, note });
  },
  async getLog(context, filters) {
    return api.getDuesLog(filters);
  },
  // The members who pay dues: regular members and admins. The list is not
  // committed to the members module, whose list other pages filter differently.
  async getPayingMembers() {
    return api.getMembers({
      type: "admin,member",
      status: "active,paused,created",
    });
  },
};

export default {
  namespaced: true,
  actions,
};
