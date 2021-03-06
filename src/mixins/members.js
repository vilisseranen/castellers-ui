import api from "../api/castellers";

export const memberMixin = {
  methods: {
    deleteUser: function (member) {
      const self = this;
      return new Promise((resolve, reject) => {
        this.$buefy.dialog.confirm({
          message:
            this.$t("members.confirmDelete") +
            " <b>" +
            member.firstName +
            " " +
            member.lastName +
            "</b> ?",
          confirmText: this.$t("members.okDelete"),
          cancelText: this.$t("members.cancelDelete"),
          type: "is-danger",
          onConfirm: () => {
            api
              .deleteMember(self.uuid, member.uuid)
              .then(function () {
                resolve();
              })
              .catch(function (err) {
                reject(err);
              });
          },
        });
      });
    },
  },
};
