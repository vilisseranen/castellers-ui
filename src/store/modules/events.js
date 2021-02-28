import api from "../../api/castellers";
import helper from "../../api/dateTimeHelper";

// initial state
const state = () => ({
  events: {}
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
      response = api.getEventsAsAdmin(uuid);
    } else if (uuid) {
      response = api.getEventsAsMember(uuid);
    } else {
      response = api.getEventsAsGuest();
    }
    response.then(function(response) {
      var events = {};
      for (var i = 0; i < response.data.length; i++) {
        const uuid = response.data[i].uuid;
        events[uuid] = response.data[i];
        events[uuid].date = helper.extractDate(events[uuid].startDate);
        events[uuid].start = helper.extractTime(events[uuid].startDate);
        events[uuid].end = helper.extractTime(events[uuid].endDate);
        context.commit("setEvent", events[uuid]);
      }
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
    for (var id in events) {
      const event = events[id];
      await api
        .getEventParticipationAsAdmin(adminUuid, event.uuid)
        .then(function(response) {
          event.members = response.data;
        });
      events[id] = event;
      context.commit("setEvent", event);
    }
  },
  async getEvent(context, uuid) {
    return api.getEvent(uuid).then(function(response) {
      context.commit("setEvent", response.data);
      return response;
    });
  },
  async editEvent(context, event) {
    if (event.uuid !== undefined) {
      context.commit("setEvent", event);
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
  }
};

// mutations
const mutations = {
  setEvent(state, event) {
    if (event.uuid in state.events) {
      const existingEvent = state.events[event.uuid];
      for (var key in existingEvent) {
        if (event[key] === undefined) {
          event[key] = existingEvent[key];
        }
      }
    }
    state.events[event.uuid] = event;
  },
  reset(state) {
    state.events = {};
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
