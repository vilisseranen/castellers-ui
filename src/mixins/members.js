import api from "../api/castellers";
import ConfirmModal from "../components/modals/Confirm-Modal";

export const memberMixin = {
  methods: {
    async deleteUser(member) {
      const modalPromise = this.$oruga.modal.open({
        component: ConfirmModal,
        props: {
          title:
            this.$t("members.confirmDelete") +
            " <b>" +
            member.firstName +
            " " +
            member.lastName +
            "</b> ?",
          confirm: this.$t("general.yes"),
          cancel: this.$t("general.cancel"),
        },
      });
      const result = await modalPromise.promise;
      return new Promise((resolve, reject) => {
        if (result.action == "yes") {
          api
            .deleteMember(member.uuid)
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
