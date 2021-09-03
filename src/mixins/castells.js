import api from "../api/castellers";

export const castellMixin = {
  methods: {
    deleteCastell: function (castell) {
      const self = this;
      return new Promise((resolve, reject) => {
        this.$buefy.dialog.confirm({
          message:
            this.$t("castells.confirmDelete") + " <b>" + castell.name + "</b>?",
          confirmText: this.$t("general.yes"),
          cancelText: this.$t("general.cancel"),
          type: "is-danger",
          onConfirm: () => {
            api
              .deleteCastellModel(self.uuid, castell.uuid)
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
