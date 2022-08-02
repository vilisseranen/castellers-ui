import api from "../api/castellers";
import ConfirmModal from "../components/modals/Confirm-Modal";

export const castellMixin = {
  methods: {
    async deleteCastell(castell) {
      // return new Promise(() => {
      const modalPromise = this.$oruga.modal.open({
        component: ConfirmModal,
        props: {
          title:
            this.$t("castells.confirmDelete") + " <b>" + castell.name + "</b>?",
          confirm: this.$t("general.yes"),
          cancel: this.$t("general.cancel"),
        },
      });
      const result = await modalPromise.promise;
      return new Promise((resolve, reject) => {
        if (result.action == "yes") {
          api
            .deleteCastellModel(castell.uuid)
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
