import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./i18n";
import Oruga from "@oruga-ui/oruga-next";
import { bulmaConfig } from "@oruga-ui/theme-bulma";

import "./registerServiceWorker";

import notifications from "./mixins/notifications";

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

createApp({
  extends: App,
  mixins: [notifications],
})
  .use(store)
  .use(router)
  .use(i18n)
  .use(Oruga, bulmaConfig)
  .mount("#app");
