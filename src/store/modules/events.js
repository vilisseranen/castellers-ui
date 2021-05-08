import api from "../../api/castellers";
import helper from "../../api/dateTimeHelper";
// import Vue from "vue";

// initial state
const state = () => ({
  events: [],
  pagination: {
    page: 0,
    limit: 12
  }
});

// getters
const getters = {};

// actions
const actions = {
  async getEvents(context) {
    const uuid = context.rootGetters.uuid;
    const type = context.rootGetters.type;
    let response;
    if (uuid && type === "admin") {
      response = api.getEventsAsAdmin(uuid, context.state.pagination);
    } else if (uuid) {
      response = api.getEventsAsMember(uuid, context.state.pagination);
    } else {
      response = api.getEventsAsGuest(context.state.pagination);
    }
    response.then(function(response) {
      const events = [];
      for (let i = 0; i < response.data.length; i++) {
        events[i] = response.data[i];
        events[i].date = helper.extractDate(events[i].startDate);
        events[i].start = helper.extractTime(events[i].startDate);
        events[i].end = helper.extractTime(events[i].endDate);
      }
      context.commit("setEvents", events);
      return response;
    });
    return response;
  },
  async participateEvent(
    context,
    { eventUuid, participation, token, userUuid }
  ) {
    if (token && userUuid) {
      return api.participateEvent(userUuid, eventUuid, participation, token);
    }
    return api.participateEvent(
      context.rootGetters.uuid,
      eventUuid,
      participation
    );
  },
  async getEventParticipation(context, eventUuid) {
    const adminUuid = context.rootGetters.uuid;
    return api.getEventParticipationAsAdmin(adminUuid, eventUuid);
  },
  async getEventsParticipation(context) {
    await this.dispatch("events/getEvents");
    const events = context.state.events;
    const adminUuid = context.rootGetters.uuid;
    for (const i in events) {
      const event = events[i];
      await api
        .getEventParticipationAsAdmin(adminUuid, event.uuid)
        .then(function(response) {
          event.members = response.data;
        });
      context.commit("setEvent", { event: events[i], index: i });
    }
  },
  async getEvent(context, uuid) {
    return api.getEvent(uuid).then(function(response) {
      for (let i = 0; i < context.state.events.length; i++) {
        if (context.state.events[i].uuid === response.data.uuid) {
          context.commit("setEvent", { event: response.data, index: i });
        }
      }
      return response;
    });
  },
  async editEvent(context, event) {
    if (event.uuid !== undefined) {
      for (let i = 0; i < context.state.events.length; i++) {
        if (context.state.events[i].uuid === event.uuid) {
          context.commit("setEvent", { event: event, index: i });
        }
      }
      return api.editEvent(context.rootGetters.uuid, event);
    } else {
      return api.createEvent(context.rootGetters.uuid, event);
    }
  },
  async presenceEvent(context, { eventUuid, memberUuid, presence }) {
    return api.presenceEvent(
      context.rootGetters.uuid,
      eventUuid,
      memberUuid,
      presence
    );
  },
  changePagination(context, pagination) {
    context.commit("setPagination", pagination);
    context.dispatch("getEvents");
  }
};

// mutations
const mutations = {
  setEvent(state, { event, index }) {
    for (const key in state.events[index]) {
      if (event[key] === undefined) {
        event[key] = state.events[index][key];
      }
    }
    state.events.splice(index, 1, event);
  },
  setEvents(state, events) {
    state.events = events;
  },
  setPagination(state, pagination) {
    state.pagination = pagination;
  },
  reset(state) {
    state.events = [];
    state.pagination = { limit: 12 };
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
