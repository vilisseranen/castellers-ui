export default {
  methods: {
    $notifyOK(text) {
      this.$buefy.snackbar.open({
        message: text,
        type: "is-success",
        queue: false,
        position: "is-bottom-left",
      });
    },
    $notifyNOK(text) {
      this.$buefy.snackbar.open({
        message: text,
        type: "is-danger",
        queue: false,
        position: "is-bottom-left",
        indefinite: true,
      });
    },
  },
};
