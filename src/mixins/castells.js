import api from "../api/castellers";

export const castellMixin = {
  methods: {
    deleteCastell: function (castell) {
      return new Promise((resolve, reject) => {
        this.$buefy.dialog.confirm({
          message:
            this.$t("castells.confirmDelete") + " <b>" + castell.name + "</b>?",
          confirmText: this.$t("general.yes"),
          cancelText: this.$t("general.cancel"),
          type: "is-danger",
          onConfirm: () => {
            api
              .deleteCastellModel(castell.uuid)
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
