export default {
  methods: {
    $notifyOK: function (text) {
      this.$oruga.notification.open({
        duration: 3500,
        message: text,
        variant: "success",
        queue: false,
        position: "bottom-left",
        closable: true,
      });
    },
    $notifyNOK: function (text) {
      this.$oruga.notification.open({
        message: text,
        variant: "danger",
        queue: false,
        position: "bottom-left",
        indefinite: true,
        closable: true,
      });
    },
  },
};
