import axios from "axios";

// axios.interceptors.response.use(undefined, function(error) {
//   if (error) {
//     console.log("intercepted error");
//     const originalRequest = error.config;
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       // refresh token
//       apiCall(
//         "POST",
//         `/api/refresh`,
//         {},
//         { refresh_token: self.$store.getters.refresh_token }
//       );
//     }
//   }
// });

// function apiCall(method, url, headers, data) {
//   return new Promise((resolve, reject) => {
//     axios({
//       method: method,
//       url: url,
//       headers: headers,
//       data: data
//     })
//       .then(function(response) {
//         resolve(response);
//       })
//       .catch(function(error) {
//         reject(error);
//       });
//   });
// }

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
      const accessToken = this.$store.getters.accessToken;
      const type = this.$store.getters.type;
      let url;
      if (type === "admin") {
        url = `/api/admins/${uuid}/events`;
      } else if (this.uuid) {
        url = `/api/members/${uuid}/events`;
      } else {
        url = `/api/events`;
      }
      return apiCall(
        "GET",
        url,
        { Authorization: `Bearer: ${accessToken}` },
        null
      );
    };
    Vue.prototype.$getEventParticipation = function(uuid) {
      const admin = this.$store.getters.uuid;
      const accessToken = this.$store.getters.accessToken;
      return apiCall(
        "GET",
        `/api/admins/${admin}/events/${uuid}/members`,
        { Authorization: `Bearer: ${accessToken}` },
        null
      );
    };
    Vue.prototype.$resendEmail = function(user) {
      const admin = this.$store.getters.uuid;
      const accessToken = this.$store.getters.accessToken;
      return apiCall(
        "GET",
        `/api/admins/${admin}/members/${user}/registration`,
        { Authorization: `Bearer: ${accessToken}` },
        null
      );
    };
    Vue.prototype.$login = function(username, password) {
      return apiCall("POST", `/api/login`, null, {
        username: username,
        password: password
      });
    };
    Vue.prototype.$refreshtoken = function(token) {
      console.log("refreshing token");
      return apiCall("POST", `/api/refresh`, null, {
        refresh_token: token
      });
    };
    Vue.prototype.$getRoles = function() {
      return apiCall("GET", "/api/roles", null, null);
    };
    Vue.prototype.$getEvent = function(uuid) {
      const accessToken = this.$store.getters.accessToken;
      return apiCall(
        "GET",
        `/api/events/${uuid}`,
        { Authorization: `Bearer: ${accessToken}` },
        null
      );
    };
    Vue.prototype.$editEvent = function(event) {
      const admin = this.$store.getters.uuid;
      const accessToken = this.$store.getters.accessToken;
      let method = "post";
      let url = `/api/admins/${admin}/events`;
      if (event.uuid !== undefined) {
        method = "put";
        url += `/${event.uuid}`;
      }
      return apiCall(
        method,
        url,
        { Authorization: `Bearer: ${accessToken}` },
        event
      );
    };
    Vue.prototype.$presenceEvent = function(eventUuid, memberUuid, presence) {
      const admin = this.$store.getters.uuid;
      const accessToken = this.$store.getters.accessToken;
      return apiCall(
        "POST",
        `/api/admins/${admin}/events/${eventUuid}/members/${memberUuid}`,
        { Authorization: `Bearer: ${accessToken}` },
        { presence: presence }
      );
    };
    Vue.prototype.$participateEvent = function(eventUuid, participation) {
      const uuid = this.$store.getters.uuid;
      const accessToken = this.$store.getters.accessToken;
      return apiCall(
        "POST",
        `/api/events/${eventUuid}/members/${uuid}`,
        { Authorization: `Bearer: ${accessToken}` },
        { answer: participation }
      );
    };
    Vue.prototype.$getMember = function(uuid) {
      const admin = this.$store.getters.uuid;
      const accessToken = this.$store.getters.accessToken;
      const type = this.$store.getters.type;
      let url = `/api/members/${uuid}`;
      if (type === "admin") {
        url = `/api/admins/${admin}/members/${uuid}`;
      }
      return apiCall(
        "GET",
        url,
        { Authorization: `Bearer: ${accessToken}` },
        null
      );
    };
    Vue.getMember = function(uuid, accessToken) {
      const url = `/api/members/${uuid}`;
      return apiCall(
        "GET",
        url,
        { Authorization: `Bearer: ${accessToken}` },
        null
      );
    };
    Vue.prototype.$getMembers = function() {
      const admin = this.$store.getters.uuid;
      const accessToken = this.$store.getters.accessToken;
      return apiCall(
        "GET",
        `/api/admins/${admin}/members`,
        { Authorization: `Bearer: ${accessToken}` },
        null
      );
    };
    Vue.prototype.$editMember = function(user) {
      const admin = this.$store.getters.uuid;
      const accessToken = this.$store.getters.accessToken;
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
      return apiCall(
        method,
        url,
        { Authorization: `Bearer: ${accessToken}` },
        user
      );
    };
    // axios.interceptors.response.use(undefined, function(error) {
    //   // var self = this;
    //   console.log(this.$store);
    //   if (error) {
    //     console.log("intercepted error");
    //     const originalRequest = error.config;
    //     if (error.response.status === 401 && !originalRequest._retry) {
    //       originalRequest._retry = true;
    //       // refresh token
    //       Vue.prototype.$refreshtoken(Vue.$store.getters.refreshToken);
    //     }
    //   }
    // });
  }
};

export default Api;
