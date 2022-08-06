<template>
  <router-view />
</template>

<style lang="scss">
@import "scss/main.scss";

html {
  overflow-y: auto;
}
</style>

<script>
export default {
  methods: {
    setLocale: function (locale) {
      this.$i18n.locale = locale;
    },
    checkAction() {
      if ("action" in this.$route.query) {
        const action = {};
        action.type = this.$route.query.action;
        action.objectUUID = this.$route.query.objectUUID;
        action.payload = this.$route.query.payload;
        this.$store.commit("setAction", action);
      }
    },
  },
  mounted() {
    this.checkAction(); // check for an action to perform
  },
};
</script>
