import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./i18n";
import buefy from "./buefy";
import axios from "axios";
import "./registerServiceWorker";

import notifications from "./notifications";
import { cookieMixin } from "./mixins/cookies";

import Api from "./plugins/api";

Vue.config.productionTip = false;

Vue.use(cookieMixin);
Vue.use(Api);

new Vue({
  router,
  store,
  i18n,
  buefy,
  notifications,
  mixins: [cookieMixin],
  render: h => h(App),
  methods: {
    setLocale: function(locale) {
      this.$i18n.locale = locale;
      this.$store.commit("setLanguage", locale);
    },
    globalRedirect() {
      if ("next" in this.$route.query) {
        this.$router.push(this.$route.query.next);
      }
    },
    checkAction() {
      if ("action" in this.$route.query) {
        var action = {};
        action.type = this.$route.query.action;
        action.objectUUID = this.$route.query.objectUUID;
        action.payload = this.$route.query.payload;
        this.$store.commit("setAction", action);
      }
    },
    checkCredentials() {
      var self = this;
      var cookieMember = this.getCookie("member");
      var cookieCode = this.getCookie("code");
      if (cookieMember && cookieCode) {
        axios
          .get("/api/members/" + cookieMember, {
            headers: { "X-Member-Code": cookieCode }
          })
          .then(function(response) {
            self.$store.commit("authenticate", {
              uuid: response.data.uuid,
              code: cookieCode,
              type: response.data.type,
              language: response.data.language
            });
            self.setLocale(response.data.language);
            self.globalRedirect();
          })
          .catch(err => {
            console.log(err);
          });
      } else if ("c" in this.$route.query && "m" in this.$route.query) {
        axios
          .get("/api/members/" + this.$route.query.m, {
            headers: { "X-Member-Code": this.$route.query.c }
          })
          .then(function(response) {
            self.$store.commit("authenticate", {
              uuid: response.data.uuid,
              code: self.$route.query.c,
              type: response.data.type,
              language: response.data.language
            });
            self.setLocale(response.data.language);
            self.globalRedirect();
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        self.globalRedirect();
      }
    }
  },
  mounted() {
    this.checkAction(); // check for an action to perform
    this.checkCredentials(); // log in and go to next page
  }
}).$mount("#app");
