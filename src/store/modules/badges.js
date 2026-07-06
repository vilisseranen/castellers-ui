import api from "../../api/castellers";

// initial state
const state = () => ({
  series: [],
});

// getters
const getters = {
  badgeSeries: (state) => state.series,
  allBadges: (state) =>
    state.series.reduce((acc, s) => acc.concat(s.badges), []),
};

// actions
const actions = {
  async getBadges(context) {
    return api.getBadges().then(function (response) {
      context.commit("setSeries", response.data);
      return response;
    });
  },
  async getMemberBadges(context, memberUuid) {
    return api.getMemberBadges(memberUuid);
  },
  async getBadgeMembers(context, badgeUuid) {
    return api.getBadgeMembers(badgeUuid);
  },
  async assignBadge(context, { badgeUuid, memberUuids }) {
    return api.assignBadge(badgeUuid, memberUuids);
  },
  async removeBadge(context, { badgeUuid, memberUuids }) {
    return api.removeBadge(badgeUuid, memberUuids);
  },
};

// mutations
const mutations = {
  setSeries(state, series) {
    state.series = series || [];
  },
  reset(state) {
    state.series = [];
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
