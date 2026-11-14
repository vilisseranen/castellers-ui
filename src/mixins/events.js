import api from "../api/castellers";
import ConfirmModal from "../components/modals/Confirm-Modal.vue";
import { escapeHtml } from "../api/htmlHelper";

export const eventMixin = {
  methods: {
    async deleteEvent(event) {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      const date = new Date(event.startDate * 1000);
      const startDate = Intl.DateTimeFormat("fr-FR", options).format(date);
      // Members are only told about the deletion of an event that is still to
      // come: the choice is only offered then.
      const upcoming = event.startDate * 1000 > Date.now();
      const props = {
        // The modal renders its title as HTML.
        title:
          this.$t("events.confirmDelete") +
          " <b>" +
          escapeHtml(event.name) +
          "</b> (" +
          startDate +
          ")",
        confirm: this.$t("general.yes"),
        cancel: this.$t("general.cancel"),
      };
      if (upcoming) {
        props.checkboxLabel = this.$t("events.deleteNotify");
        props.checkboxHelp = this.$t("events.deleteNotifyHelp");
        props.checkboxChecked = true;
      }
      const modalPromise = this.$oruga.modal.open({
        component: ConfirmModal,
        props,
      });
      const result = await modalPromise.promise;
      return new Promise((resolve, reject) => {
        if (result.action == "yes") {
          const notify = !upcoming || result.checked !== false;
          api
            .deleteEvent(event.uuid, notify)
            .then(function () {
              resolve();
            })
            .catch(function (err) {
              reject(err);
            });
        }
        resolve();
      });
    },
  },
};
