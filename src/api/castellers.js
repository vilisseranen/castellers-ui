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
      url: API_URL + "/api/v1" + url,
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
    return apiCall("POST", `/login`, null, {
      username: username,
      password: password,
    }).then(function (response) {
      axios.defaults.headers.common.Authorization = `Bearer: ${response.data.access_token}`;
      return response;
    });
  },
  async refreshToken(token) {
    return apiCall("POST", `/refresh`, null, {
      refresh_token: token,
    }).then(function (response) {
      axios.defaults.headers.common.Authorization = `Bearer: ${response.data.access_token}`;
      return response;
    });
  },
  async getRoles() {
    return apiCall("GET", `/members/roles`, {}, null);
  },
  async getEvent(uuid) {
    return apiCall("GET", `/events/${uuid}`, {}, null);
  },
  async editEvent(event) {
    return apiCall("PUT", `/events/${event.uuid}`, {}, event);
  },
  async createEvent(event) {
    return apiCall("POST", `/events`, {}, event);
  },
  async deleteEvent(eventUuid) {
    return apiCall("DELETE", `/events/${eventUuid}`, {}, null);
  },
  async presenceEvent(eventUuid, memberUuid, presence) {
    return apiCall(
      "POST",
      `/events/${eventUuid}/members/${memberUuid}`,
      {},
      { presence: presence }
    );
  },
  async participateEvent(eventUuid, participation, token) {
    let authorizationHeader = {};
    if (token != null) {
      authorizationHeader = { Authorization: `Bearer: ${token}` };
    }
    return apiCall(
      "POST",
      `/members/events/${eventUuid}`,
      authorizationHeader,
      { answer: participation }
    );
  },
  async getMember(uuid) {
    return apiCall("GET", `/members/${uuid}`, {}, null);
  },
  async getMembers() {
    return apiCall("GET", `/members`, {}, null);
  },
  async editMember(member) {
    return apiCall("PUT", `/members/${member.uuid}`, {}, member);
  },
  async createMember(member) {
    return apiCall("POST", `/members`, {}, member);
  },
  async deleteMember(memberUuid) {
    return apiCall("DELETE", `/members/${memberUuid}`, {}, null);
  },
  async getEvents(options) {
    let endpoint = "/events";
    if (options) {
      endpoint = `${endpoint}?page=${options.page}&limit=${options.limit}`;
    }
    return apiCall("GET", endpoint, {}, null);
  },
  async getEventParticipation(eventUuid) {
    return apiCall("GET", `/events/${eventUuid}/members`, {}, null);
  },
  async getInitialize() {
    return apiCall("GET", "/initialize", null, null);
  },
  async initialize(payload) {
    return apiCall("POST", "/initialize", null, payload);
  },
  async resendEmail(userUuid) {
    return apiCall("GET", `/members/${userUuid}/registration`, {}, null);
  },
  async resetPassword(username, password, token) {
    return apiCall(
      "POST",
      `/reset_credentials`,
      { Authorization: `Bearer: ${token}` },
      { username: username, password: password }
    );
  },
  async forgotPassword(email) {
    return apiCall("POST", `/forgot_password`, {}, { email: email });
  },
  async changePassword(password) {
    return apiCall("POST", `/change_password`, {}, { password: password });
  },
  async version() {
    return apiCall("GET", `/version`, {}, {});
  },
  async getCastellsTypeList() {
    return apiCall("GET", `/castells/types`, {}, {});
  },
  async getCastellTypePositions(type) {
    return apiCall("GET", `/castells/types/${type}`, {}, {});
  },
  async getCastellModels() {
    return apiCall("GET", `/castells/models`, {}, {});
  },
  async getCastellModel(uuid) {
    return apiCall("GET", `/castells/models/${uuid}`, {}, {});
  },
  async createCastellModel(model) {
    return apiCall("POST", `/castells/models`, {}, model);
  },
  async updateCastellModel(model) {
    return apiCall("PUT", `/castells/models/${model.uuid}`, {}, model);
  },
  async deleteCastellModel(uuid) {
    return apiCall("DELETE", `/castells/models/${uuid}`, {}, {});
  },
};
