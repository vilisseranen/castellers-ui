import axios from "axios";

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

export default {
  async login(username, password) {
    return apiCall("POST", `/api/login`, null, {
      username: username,
      password: password
    }).then(function(response) {
      axios.defaults.headers.common.Authorization = `Bearer: ${response.data.access_token}`;
      return response;
    });
  },
  async refreshToken(token) {
    return apiCall("POST", `/api/refresh`, null, {
      refresh_token: token
    }).then(function(response) {
      axios.defaults.headers.common.Authorization = `Bearer: ${response.data.access_token}`;
      return response;
    });
  },
  async getRoles() {
    return apiCall("GET", `/api/roles`, {}, null);
  },
  async getEvent(uuid) {
    return apiCall("GET", `/api/events/${uuid}`, {}, null);
  },
  async editEvent(adminUuid, event) {
    return apiCall(
      "PUT",
      `/api/admins/${adminUuid}/events/${event.uuid}`,
      {},
      event
    );
  },
  async createEvent(adminUuid, event) {
    return apiCall("POST", `/api/admins/${adminUuid}/events`, {}, event);
  },
  async presenceEvent(adminUuid, eventUuid, memberUuid, presence) {
    return apiCall(
      "POST",
      `/api/admins/${adminUuid}/events/${eventUuid}/members/${memberUuid}`,
      {},
      { presence: presence }
    );
  },
  async participateEvent(memberUuid, eventUuid, participation) {
    return apiCall(
      "POST",
      `/api/events/${eventUuid}/members/${memberUuid}`,
      {},
      { answer: participation }
    );
  },
  async getMemberAsMember(uuid) {
    return apiCall("GET", `/api/members/${uuid}`, {}, null);
  },
  async getMemberAsAdmin(uuid) {
    return apiCall("GET", `/api/admins/${uuid}/members/${uuid}`, {}, null);
  },
  async getMembersAsAdmin(uuid) {
    return apiCall("GET", `/api/admins/${uuid}/members`, {}, null);
  },
  async editMemberAsAdmin(adminUuid, member) {
    return apiCall(
      "PUT",
      `/api/admins/${adminUuid}/members/${member.uuid}`,
      {},
      member
    );
  },
  async editMemberAsMember(member) {
    return apiCall("PUT", `/api/members/${member.uuid}`, {}, member);
  },
  async createMemberAsAdmin(adminUuid, member) {
    return apiCall("POST", `/api/admins/${adminUuid}/members`, {}, member);
  },
  async getEventsAsGuest() {
    return apiCall("GET", `/api/events`, {}, null);
  },
  async getEventsAsMember(uuid) {
    return apiCall("GET", `/api/members/${uuid}/events`, {}, null);
  },
  async getEventsAsAdmin(uuid) {
    return apiCall("GET", `/api/admins/${uuid}/events`, {}, null);
  },
  async getEventParticipationAsAdmin(adminUuid, eventUuid) {
    return apiCall(
      "GET",
      `/api/admins/${adminUuid}/events/${eventUuid}/members`,
      {},
      null
    );
  },
  async getInitialize() {
    return apiCall("GET", "/api/initialize", null, null);
  },
  async initialize(payload) {
    return apiCall("POST", "/api/initialize", null, payload);
  },
  async resendEmailAsAdmin(adminUuid, userUuid) {
    return apiCall(
      "GET",
      `/api/admins/${adminUuid}/members/${userUuid}/registration`,
      {},
      null
    );
  }
};
