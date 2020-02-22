const axios = require("axios");

export var eventMixin = {
  methods: {
    deleteEvent: function(event) {
      var self = this;
      var options = { year: "numeric", month: "2-digit", day: "2-digit" };
      var date = new Date(event.startDate * 1000);
      var startDate = Intl.DateTimeFormat("fr-FR", options).format(date);
      return new Promise((resolve, reject) => {
        this.$buefy.dialog.confirm({
          message:
            this.$t("events.confirmDelete") +
            " <b>" +
            event.name +
            "</b> (" +
            startDate +
            ")",
          confirmText: this.$t("events.deleteOK"),
          cancelText: this.$t("events.deleteCancel"),
          type: "is-danger",
          onConfirm: () => {
            axios
              .delete(`api/admins/${self.uuid}/events/${event.uuid}`, {
                headers: { "X-Member-Code": self.code }
              })
              .then(function() {
                resolve();
              })
              .catch(function(err) {
                reject(err);
              });
          }
        });
      });
    }
  }
};
