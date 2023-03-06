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
  async logout() {
    delete axios.defaults.headers.common.Authorization;
  },
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
  async getEvent(uuid, token) {
    let authorizationHeader = {};
    if (token != null) {
      authorizationHeader = { Authorization: `Bearer: ${token}` };
    }
    return apiCall("GET", `/events/${uuid}`, authorizationHeader, null);
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
  async participateEvent(memberUuid, eventUuid, participation, token) {
    let authorizationHeader = {};
    if (token != null) {
      authorizationHeader = { Authorization: `Bearer: ${token}` };
    }
    return apiCall(
      "POST",
      `/members/${memberUuid}/events/${eventUuid}`,
      authorizationHeader,
      { answer: participation }
    );
  },
  async getMember(uuid) {
    return apiCall("GET", `/members/${uuid}`, {}, null);
  },
  async getMembers(options) {
    let endpoint = "/members";
    let queryParams = [];
    if (options && options.type.length > 0) {
      queryParams.push(`type=${options.type}`);
    }
    if (options && options.status.length > 0) {
      queryParams.push(`status=${options.status}`);
    }
    queryParams = queryParams.join("&");
    endpoint = [endpoint, queryParams].join("?");
    return apiCall("GET", endpoint, {}, null);
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
  async getEventParticipation(eventUuid, options) {
    let endpoint = `/events/${eventUuid}/members`;
    let queryParams = [];
    if (options && options.type) {
      queryParams.push(`type=${options.type}`);
    }
    if (options && options.status) {
      queryParams.push(`status=${options.status}`);
    }
    queryParams = queryParams.join("&");
    endpoint = [endpoint, queryParams].join("?");

    return apiCall("GET", endpoint, {}, null);
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
  async getCastellModels(event) {
    let url = `/castells/models`;
    if (event) {
      url += `?event=${event}`;
    }
    return apiCall("GET", url, {}, {});
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
  async attachCastellModel(modelUuid, eventUuid) {
    return apiCall(
      "POST",
      `/castells/models/${modelUuid}/events/${eventUuid}`,
      {},
      {}
    );
  },
  async detachCastellModel(modelUuid, eventUuid) {
    return apiCall(
      "DELETE",
      `/castells/models/${modelUuid}/events/${eventUuid}`,
      {},
      {}
    );
  },
};
