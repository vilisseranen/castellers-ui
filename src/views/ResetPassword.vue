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
          <fieldset :disabled="action === 'reset' ? true : false">
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
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return { resetToken: "", credentials: {}, action: "" };
  },
  computed: {
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
    }
  },
  mounted() {
    if ("t" in this.$route.query) {
      this.resetToken = this.$route.query.t;
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
      resetPassword: "resetPassword",
      getLogin: "login"
    }),
    async reset() {
      var self = this;
      if (this.passwordConfirmDifferent) {
        this.$notifyNOK(this.$t("login.passwordDifferent"));
      } else {
        this.resetPassword({
          username: this.credentials.username,
          password: this.credentials.password,
          token: this.resetToken
        })
          .then(function() {
            self
              .getLogin({
                username: self.credentials.username,
                password: self.credentials.password
              })
              .then(function() {
                self.$root.setLocale(self.$store.getters.language);
                self.$router.push({ name: "Events" });
              });
          })
          .catch(function() {
            self.$notifyNOK(self.$t("login.passwordResetError"));
          });
      }
    }
  }
};
</script>
