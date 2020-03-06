import axios from "axios";

const Api = {
  install(Vue, options) {
    Vue.prototype.$getInitialize = function() {
      return new Promise((resolve, reject) => {
        axios
          .get("/api/initialize")
          .then(function(response) {
            resolve(response);
          })
          .catch(function(error) {
            reject(error);
          });
      });
    };
    Vue.prototype.$initialize = function(user) {
      return new Promise((resolve, reject) => {
        axios
          .post("/api/initialize", user)
          .then(function(response) {
            resolve(response);
          })
          .catch(function(error) {
            reject(error);
          });
      });
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
      return new Promise((resolve, reject) => {
        axios
          .get(url, { headers: { "X-Member-Code": code } })
          .then(function(response) {
            resolve(response);
          })
          .catch(function(error) {
            reject(error);
          });
      });
    };
    Vue.prototype.$getEventParticipation = function(uuid) {
      const admin = this.$store.getters.uuid;
      const code = this.$store.getters.code;
      return new Promise((resolve, reject) => {
        axios
          .get(`/api/admins/${admin}/events/${uuid}/members`, {
            headers: { "X-Member-Code": code }
          })
          .then(function(response) {
            resolve(response);
          })
          .catch(function(error) {
            reject(error);
          });
      });
    };
    Vue.prototype.$resendEmail = function(user) {
      const admin = this.$store.getters.uuid;
      const code = this.$store.getters.code;
      return new Promise((resolve, reject) => {
        axios
          .get(`/api/admins/${admin}/members/${user}/registration`, {
            headers: { "X-Member-Code": code }
          })
          .then(function(response) {
            resolve(response);
          })
          .catch(function(error) {
            reject(error);
          });
      });
    };
    Vue.prototype.$login = function(uuid, code) {
      return new Promise((resolve, reject) => {
        axios
          .get("/api/members/" + uuid, {
            headers: { "X-Member-Code": code }
          })
          .then(function(response) {
            resolve(response);
          })
          .catch(function(error) {
            reject(error);
          });
      });
    };
    Vue.prototype.$getRoles = function() {
      return new Promise((resolve, reject) => {
        axios
          .get("/api/roles")
          .then(function(response) {
            resolve(response);
          })
          .catch(function(error) {
            reject(error);
          });
      });
    };
    Vue.prototype.$getEvent = function(uuid) {
      const code = this.$store.getters.code;
      return new Promise((resolve, reject) => {
        axios
          .get(`/api/events/${uuid}`, { headers: { "X-Member-Code": code } })
          .then(function(response) {
            resolve(response);
          })
          .catch(function(error) {
            reject(error);
          });
      });
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
      return new Promise((resolve, reject) => {
        axios({
          method: method,
          url: url,
          headers: { "X-Member-Code": code },
          data: event
        })
          .then(function(response) {
            resolve(response);
          })
          .catch(function(error) {
            reject(error);
          });
      });
    };
    Vue.prototype.$presenceEvent = function(eventUuid, memberUuid, presence) {
      const admin = this.$store.getters.uuid;
      const code = this.$store.getters.code;
      return new Promise((resolve, reject) => {
        axios
          .post(
            `/api/admins/${admin}/events/${eventUuid}/members/${memberUuid}`,
            { presence: presence },
            { headers: { "X-Member-Code": code } }
          )
          .then(function(response) {
            resolve(response);
          })
          .catch(function(error) {
            reject(error);
          });
      });
    };
    Vue.prototype.$participateEvent = function(eventUuid, participation) {
      const uuid = this.$store.getters.uuid;
      const code = this.$store.getters.code;
      return new Promise((resolve, reject) => {
        axios
          .post(
            `/api/events/${eventUuid}/members/${uuid}`,
            { answer: participation },
            { headers: { "X-Member-Code": code } }
          )
          .then(function(response) {
            resolve(response);
          })
          .catch(function(error) {
            reject(error);
          });
      });
    };
    Vue.prototype.$getMember = function(uuid) {
      const admin = this.$store.getters.uuid;
      const code = this.$store.getters.code;
      const type = this.$store.getters.type;
      let url = `/api/members/${uuid}`;
      if (type === "admin") {
        url = `/api/admins/${admin}/members/${uuid}`;
      }
      return new Promise((resolve, reject) => {
        axios({
          method: "get",
          url: url,
          headers: { "X-Member-Code": code }
        })
          .then(function(response) {
            resolve(response);
          })
          .catch(function(error) {
            reject(error);
          });
      });
    };
    Vue.prototype.$getMembers = function() {
      const admin = this.$store.getters.uuid;
      const code = this.$store.getters.code;
      return new Promise((resolve, reject) => {
        axios({
          method: "get",
          url: `/api/admins/${admin}/members`,
          headers: { "X-Member-Code": code }
        })
          .then(function(response) {
            resolve(response);
          })
          .catch(function(error) {
            reject(error);
          });
      });
    };
    Vue.prototype.$editMember = function(user) {
      const admin = this.$store.getters.admin;
      const code = this.$store.getters.code;
      const type = this.$store.getters.type;
      let method = "post";
      let url = `/api/admins/${admin}/members`;
      if (user.uuid !== undefined) {
        method = "put";
        url += `/${user.uuid}`;
        if (type === "admin") {
          url = `/api/members/${user.uuid}`;
        }
      }
      return new Promise((resolve, reject) => {
        axios({
          method: method,
          url: url,
          headers: { "X-Member-Code": code },
          data: user
        })
          .then(function(response) {
            resolve(response);
          })
          .catch(function(error) {
            reject(error);
          });
      });
    };
  }
};

export default Api;
