import api from "../api/castellers";
import ConfirmModal from "../components/modals/Confirm-Modal";

export const eventMixin = {
  methods: {
    async deleteEvent(event) {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      const date = new Date(event.startDate * 1000);
      const startDate = Intl.DateTimeFormat("fr-FR", options).format(date);
      const modalPromise = this.$oruga.modal.open({
        component: ConfirmModal,
        props: {
          title:
            this.$t("events.confirmDelete") +
            " <b>" +
            event.name +
            "</b> (" +
            startDate +
            ")",
          confirm: this.$t("general.yes"),
          cancel: this.$t("general.cancel"),
        },
      });
      const result = await modalPromise.promise;
      return new Promise((resolve, reject) => {
        if (result.action == "yes") {
          api
            .deleteEvent(event.uuid)
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
