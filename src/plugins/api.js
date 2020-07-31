import axios from "axios";

const Api = {
  install(Vue, opts) {
    const apiCall = function(method, url, headers, data) {
      return new Promise((resolve, reject) => {
        axios({
          method: method,
          url: url,
          headers: headers,
          data: data
        })
          .then(function(response) {
            resolve(response);
          })
          .catch(function(error) {
            reject(error);
          });
      });
    };
    Vue.prototype.$getInitialize = function() {
      return apiCall("GET", "/api/initialize", null, null);
    };
    Vue.prototype.$initialize = function(user) {
      return apiCall("POST", "/api/initialize", null, user);
    };
    Vue.prototype.$getEvents = function() {
      const uuid = this.$store.getters.uuid;
      const code = this.$store.getters.code;
      const type = this.$store.getters.type;
      let url;
      if (type === "admin") {
        url = `/api/admins/${uuid}/events`;
      } else if (this.uuid) {
        url = `/api/members/${uuid}/events`;
      } else {
        url = `/api/events`;
      }
      return apiCall("GET", url, { "X-Member-Code": code }, null);
    };
    Vue.prototype.$getEventParticipation = function(uuid) {
      const admin = this.$store.getters.uuid;
      const code = this.$store.getters.code;
      return apiCall(
        "GET",
        `/api/admins/${admin}/events/${uuid}/members`,
        { "X-Member-Code": code },
        null
      );
    };
    Vue.prototype.$resendEmail = function(user) {
      const admin = this.$store.getters.uuid;
      const code = this.$store.getters.code;
      return apiCall(
        "GET",
        `/api/admins/${admin}/members/${user}/registration`,
        { "X-Member-Code": code },
        null
      );
    };
    Vue.prototype.$login = function(uuid, code) {
      return apiCall(
        "GET",
        `/api/members/${uuid}`,
        { "X-Member-Code": code },
        null
      );
    };
    Vue.prototype.$getRoles = function() {
      return apiCall("GET", "/api/roles", null, null);
    };
    Vue.prototype.$getEvent = function(uuid) {
      const code = this.$store.getters.code;
      return apiCall(
        "GET",
        `/api/events/${uuid}`,
        { "X-Member-Code": code },
        null
      );
    };
    Vue.prototype.$editEvent = function(event) {
      const admin = this.$store.getters.uuid;
      const code = this.$store.getters.code;
      let method = "post";
      let url = `/api/admins/${admin}/events`;
      if (event.uuid !== undefined) {
        method = "put";
        url += `/${event.uuid}`;
      }
      return apiCall(method, url, { "X-Member-Code": code }, event);
    };
    Vue.prototype.$presenceEvent = function(eventUuid, memberUuid, presence) {
      const admin = this.$store.getters.uuid;
      const code = this.$store.getters.code;
      return apiCall(
        "POST",
        `/api/admins/${admin}/events/${eventUuid}/members/${memberUuid}`,
        { "X-Member-Code": code },
        { presence: presence }
      );
    };
    Vue.prototype.$participateEvent = function(eventUuid, participation) {
      const uuid = this.$store.getters.uuid;
      const code = this.$store.getters.code;
      return apiCall(
        "POST",
        `/api/events/${eventUuid}/members/${uuid}`,
        { "X-Member-Code": code },
        { answer: participation }
      );
    };
    Vue.prototype.$getMember = function(uuid) {
      const admin = this.$store.getters.uuid;
      const code = this.$store.getters.code;
      const type = this.$store.getters.type;
      let url = `/api/members/${uuid}`;
      if (type === "admin") {
        url = `/api/admins/${admin}/members/${uuid}`;
      }
      return apiCall("GET", url, { "X-Member-Code": code }, null);
    };
    Vue.prototype.$getMembers = function() {
      const admin = this.$store.getters.uuid;
      const code = this.$store.getters.code;
      return apiCall(
        "GET",
        `/api/admins/${admin}/members`,
        { "X-Member-Code": code },
        null
      );
    };
    Vue.prototype.$editMember = function(user) {
      const admin = this.$store.getters.uuid;
      const code = this.$store.getters.code;
      const type = this.$store.getters.type;
      let method = "post";
      let url = `/api/admins/${admin}/members`;
      if (user.uuid !== undefined) {
        method = "put";
        url += `/${user.uuid}`;
        if (type === "member") {
          url = `/api/members/${user.uuid}`;
        }
      }
      return apiCall(method, url, { "X-Member-Code": code }, user);
    };
  }
};

export default Api;
