import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./i18n";
import buefy from "./buefy";
import axios from "axios";
import "./registerServiceWorker";

import notifications from "./notifications";

import Api from "./plugins/api";

Vue.config.productionTip = false;

// Vue.use(cookieMixin);
Vue.use(Api);

axios.interceptors.response.use(
  response => {
    return response;
  },
  async function(error) {
    const originalRequest = error.config;
    console.log(originalRequest);
    console.log(originalRequest._retry);
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log(originalRequest._retry);
      // refresh token
      await Vue.prototype
        .$refreshtoken(store.getters.refreshToken)
        .then(function(response) {
          store.commit("authenticate", response.data);
          return axios(originalRequest);
        });
      return Promise.reject(error);
    }
  }
);

new Vue({
  router,
  store,
  i18n,
  buefy,
  notifications,
  render: h => h(App),
  methods: {
    setLocale: function(locale) {
      this.$i18n.locale = locale;
    },
    checkAction() {
      if ("action" in this.$route.query) {
        var action = {};
        action.type = this.$route.query.action;
        action.objectUUID = this.$route.query.objectUUID;
        action.payload = this.$route.query.payload;
        this.$store.commit("setAction", action);
      }
    }
  },
  mounted() {
    this.checkAction(); // check for an action to perform
  }
}).$mount("#app");
