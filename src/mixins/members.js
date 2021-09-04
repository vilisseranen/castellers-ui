import api from "../api/castellers";

export const memberMixin = {
  methods: {
    deleteUser: function (member) {
      return new Promise((resolve, reject) => {
        this.$buefy.dialog.confirm({
          message:
            this.$t("members.confirmDelete") +
            " <b>" +
            member.firstName +
            " " +
            member.lastName +
            "</b> ?",
          confirmText: this.$t("general.yes"),
          cancelText: this.$t("general.cancel"),
          type: "is-danger",
          onConfirm: () => {
            api
              .deleteMember(member.uuid)
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
