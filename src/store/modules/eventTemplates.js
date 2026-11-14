import api from "../../api/castellers";

// Templates are read from the API each time: nothing is kept in the store.

// actions
const actions = {
  async getTemplates() {
    return api.getEventTemplates();
  },
  async createTemplate(context, template) {
    return api.createEventTemplate(template);
  },
  async updateTemplate(context, template) {
    return api.updateEventTemplate(template);
  },
  async deleteTemplate(context, uuid) {
    return api.deleteEventTemplate(uuid);
  },
};

export default {
  namespaced: true,
  actions,
};
