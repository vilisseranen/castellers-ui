import axios from "axios";

let API_URL;

if (process.env.NODE_ENV === "production" && process.env.VUE_APP_API_URL) {
  API_URL = "https://" + process.env.VUE_APP_API_URL;
} else {
  API_URL = "";
}

const apiCall = function (method, url, headers, data) {
  return new Promise((resolve, reject) => {
    axios({
      method: method,
      url: API_URL + url,
      headers: headers,
      data: data,
    })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

export default {
  async login(username, password) {
    return apiCall("POST", `/api/login`, null, {
      username: username,
      password: password,
    }).then(function (response) {
      axios.defaults.headers.common.Authorization = `Bearer: ${response.data.access_token}`;
      return response;
    });
  },
  async refreshToken(token) {
    return apiCall("POST", `/api/refresh`, null, {
      refresh_token: token,
    }).then(function (response) {
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
  async deleteEvent(adminUuid, eventUuid) {
    return apiCall(
      "DELETE",
      `/api/admins/${adminUuid}/events/${eventUuid}`,
      {},
      null
    );
  },
  async presenceEvent(adminUuid, eventUuid, memberUuid, presence) {
    return apiCall(
      "POST",
      `/api/admins/${adminUuid}/events/${eventUuid}/members/${memberUuid}`,
      {},
      { presence: presence }
    );
  },
  async participateEvent(memberUuid, eventUuid, participation, token) {
    let authorizationHeader = {};
    if (token != null) {
      authorizationHeader = { Authorization: `Bearer: ${token}` };
    }
    return apiCall(
      "POST",
      `/api/events/${eventUuid}/members/${memberUuid}`,
      authorizationHeader,
      { answer: participation }
    );
  },
  async getMemberAsMember(uuid) {
    return apiCall("GET", `/api/members/${uuid}`, {}, null);
  },
  async getMemberAsAdmin(adminUuid, memberUuid) {
    return apiCall(
      "GET",
      `/api/admins/${adminUuid}/members/${memberUuid}`,
      {},
      null
    );
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
  async deleteMember(adminUuid, memberUuid) {
    return apiCall(
      "DELETE",
      `/api/admins/${adminUuid}/members/${memberUuid}`,
      {},
      null
    );
  },
  async getEventsAsGuest(options) {
    let endpoint = "/api/events";
    if (options) {
      endpoint = `${endpoint}?page=${options.page}&limit=${options.limit}`;
    }
    return apiCall("GET", endpoint, {}, null);
  },
  async getEventsAsMember(uuid, options) {
    let endpoint = `/api/members/${uuid}/events`;
    if (options) {
      endpoint = `${endpoint}?page=${options.page}&limit=${options.limit}`;
    }
    return apiCall("GET", endpoint, {}, null);
  },
  async getEventsAsAdmin(uuid, options) {
    let endpoint = `/api/admins/${uuid}/events`;
    if (options) {
      endpoint = `${endpoint}?page=${options.page}&limit=${options.limit}`;
    }
    return apiCall("GET", endpoint, {}, null);
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
  },
  async resetPassword(username, password, token) {
    return apiCall(
      "POST",
      `/api/reset_credentials`,
      { Authorization: `Bearer: ${token}` },
      { username: username, password: password }
    );
  },
  async forgotPassword(email) {
    return apiCall("POST", `/api/forgot_password`, {}, { email: email });
  },
  async changePassword(userUuid, password) {
    return apiCall(
      "POST",
      `/api/members/${userUuid}/change_password`,
      {},
      { password: password }
    );
  },
  async version() {
    return apiCall("GET", `/api/version`, {}, {});
  },
  async getCastellsTypeList() {
    return apiCall("GET", `/api/v1/castells/types`, {}, {});
  },
  async getCastellTypePositions(type) {
    return apiCall("GET", `/api/v1/castells/types/${type}`, {}, {});
  },
  async getCastellModels() {
    return apiCall("GET", `/api/v1/castells/models`, {}, {});
  },
  async getCastellModel(uuid) {
    return apiCall("GET", `/api/v1/castells/models/${uuid}`, {}, {});
  },
  async createCastellModel(model) {
    return apiCall("POST", `/api/v1/castells/models`, {}, model);
  },
  async updateCastellModel(model) {
    return apiCall("PUT", `/api/v1/castells/models/${model.uuid}`, {}, model);
  },
  async deleteCastellModel(uuid) {
    return apiCall("DELETE", `/api/v1/castells/models/${uuid}`, {}, {});
  },
};
