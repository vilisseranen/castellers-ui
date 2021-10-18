import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./i18n";
import buefy from "./buefy";
import "./registerServiceWorker";

import notifications from "./notifications";

Vue.config.productionTip = false;

// Redirect if we need to log in
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.getters.isLoggedIn) {
      store.dispatch("logout");
      next({ name: "Login", query: { next: to.fullPath } });
    } else {
      next();
    }
  } else {
    next();
  }
});

new Vue({
  router,
  store,
  i18n,
  buefy,
  notifications,
  render: (h) => h(App),
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
}).$mount("#app");
