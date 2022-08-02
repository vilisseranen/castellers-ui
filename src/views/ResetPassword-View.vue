<template>
  <div>
    <section class="hero">
      <div class="hero-body has-text-centered">
        <div class="container">
          <h1 class="title">
            {{ title }}
          </h1>
        </div>
      </div>
    </section>
    <div class="columns is-centered">
      <div class="column is-one-quarter">
        <form class="loginform">
          <fieldset :disabled="action === 'reset' ? true : false" class="field">
            <div class="field">
              <label class="label">{{ $t("login.username") }}</label>
              <input
                class="input"
                type="text"
                :placeholder="$t('login.usernamePlaceholder')"
                v-model="credentials.username"
              />
            </div>
          </fieldset>
          <div class="field">
            <label class="label">{{ $t("login.password") }}</label>
            <input
              class="input"
              type="password"
              :placeholder="$t('login.passwordPlaceholder')"
              v-model="credentials.password"
            />
          </div>
          <div class="field">
            <label class="label">{{ $t("login.passwordConfirm") }}</label>
            <input
              class="input"
              v-bind:class="{ 'is-danger': passwordConfirmDifferent }"
              type="password"
              :placeholder="$t('login.passwordPlaceholder')"
              v-model="credentials.passwordConfirm"
            />
          </div>
          <div class="field is-grouped is-grouped-right">
            <button
              class="button is-primary"
              type="submit"
              @click.prevent="reset"
            >
              {{ button }}
            </button>
          </div>
        </form>
        <br />
        <b-message
          v-if="tokenExpired"
          type="is-danger"
          icon-pack="fa"
          has-icon
          aria-close-label="Link expired"
        >
          {{ $t("login.linkExpired") }}
          <button
            class="button is-danger"
            type="submit"
            @click.prevent="resendLink"
          >
            {{ $t("login.linkExpiredButton") }}
          </button>
        </b-message>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import jwtd from "jwt-decode"; // check if token is expired

export default {
  data() {
    return {
      resetToken: "",
      credentials: {},
      action: "",
      decodedToken: {},
    };
  },
  computed: {
    tokenExpired() {
      if (
        this.decodedToken &&
        this.decodedToken.exp &&
        this.decodedToken.exp < Date.now() / 1000
      ) {
        return true;
      }
      return false;
    },
    passwordConfirmDifferent() {
      if (
        this.credentials.passwordConfirm !== undefined &&
        this.credentials.passwordConfirm !== this.credentials.password
      ) {
        return true;
      }
      return false;
    },
    title() {
      if (this.action === "activation") {
        return this.$t("login.activatePasssword");
      } else if (this.action === "reset") {
        return this.$t("login.resetPassword");
      }
      return "";
    },
    button() {
      if (this.action === "activation") {
        return this.$t("login.activateButton");
      } else if (this.action === "reset") {
        return this.$t("login.resetButton");
      }
      return "";
    },
  },
  mounted() {
    if ("t" in this.$route.query) {
      this.resetToken = this.$route.query.t;
      this.decodedToken = jwtd(this.resetToken);
    }
    if ("a" in this.$route.query) {
      this.action = this.$route.query.a;
    }
    if ("u" in this.$route.query) {
      this.$set(this.credentials, "username", this.$route.query.u);
    }
  },
  methods: {
    ...mapActions({
      resetPassword: "members/resetPassword",
      forgotPassword: "members/forgotPassword",
      getLogin: "login",
    }),
    async reset() {
      const self = this;
      if (this.passwordConfirmDifferent) {
        this.$root.$notifyNOK(this.$t("login.passwordDifferent"));
      } else {
        this.resetPassword({
          username: this.credentials.username,
          password: this.credentials.password,
          token: this.resetToken,
        })
          .then(function () {
            self
              .getLogin({
                username: self.credentials.username,
                password: self.credentials.password,
              })
              .then(function () {
                if (self.action === "activation") {
                  self.$buefy.dialog.alert({
                    title: self.$t("login.success"),
                    message:
                      self.$t("login.successMessageStart") +
                      ' "' +
                      self.$t("members.updateButton") +
                      '" ' +
                      self.$t("login.successMessageEnd"),
                    hasIcon: true,
                    iconPack: "fa",
                    ariaRole: "alertdialog",
                    ariaModal: true,
                    type: "is-info",
                  });
                }
                self.$root.setLocale(self.$store.getters.language);
                self.$router.push({ name: "Events" });
              });
          })
          .catch(function () {
            self.$root.$notifyNOK(self.$t("login.passwordResetError"));
          });
      }
    },
    resendLink() {
      const self = this;
      this.forgotPassword(this.decodedToken.email)
        .then(function () {
          self.$root.$notifyOK(self.$t("login.passwordResetSent"));
        })
        .catch(function () {
          self.$root.$notifyNOK(self.$t("login.passwordResetIssue"));
        });
    },
  },
};
</script>
