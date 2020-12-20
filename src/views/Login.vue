<template>
  <div>
    <section class="hero">
      <div class="hero-body has-text-centered">
        <div class="container">
          <h1 class="title">
            {{ $t("login.title") }}
          </h1>
        </div>
      </div>
    </section>
    <div class="columns is-centered">
      <div class="column is-one-quarter">
        <form class="loginform">
          <div class="field">
            <label class="label">{{ $t("login.username") }}</label>
            <input
              class="input"
              type="text"
              :placeholder="$t('login.usernamePlaceholder')"
              v-model="member.username"
            />
          </div>
          <div class="field">
            <label class="label">{{ $t("login.password") }}</label>
            <input
              class="input"
              type="password"
              :placeholder="$t('login.passwordPlaceholder')"
              v-model="member.password"
            />
          </div>
          <div class="field is-grouped is-grouped-centered">
            <button
              class="button is-primary"
              type="submit"
              @click.prevent="login"
            >
              {{ $t("login.loginButton") }}
            </button>
          </div>
        </form>
        <div class="has-text-centered">
          <a
            class="is-size-7 has-text-weight-bold"
            v-on:click="passwordForgotten = true"
            href="#"
            >{{ $t("login.forgotPassword") }}</a
          >
        </div>
      </div>
    </div>
    <div class="columns is-centered" v-if="passwordForgotten">
      <div class="column is-one-quarter">
        <form class="loginform">
          <div class="field">
            <label class="label">{{ $t("login.email") }}</label>
            <input
              class="input"
              type="text"
              :placeholder="$t('login.emailPlaceholder')"
              v-model="member.email"
            />
          </div>
          <div class="field is-grouped is-grouped-centered">
            <button
              class="button is-primary"
              type="submit"
              @click.prevent="resetPassword"
            >
              {{ $t("login.resetPasswordButton") }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from "vuex";

export default {
  data() {
    return {
      member: {},
      passwordForgotten: false
    };
  },
  methods: {
    ...mapMutations({
      authenticate: "authenticate"
    }),
    ...mapActions({
      getLogin: "login",
      forgotPassword: "forgotPassword"
    }),
    login() {
      var self = this;
      this.getLogin({
        username: this.member.username,
        password: this.member.password
      })
        .then(function() {
          self.$root.setLocale(self.$store.getters.language);
          self.$router.push({ name: "Events" });
        })
        .catch(function(error) {
          console.log(error);
          self.$notifyNOK(self.$t("login.notifyError"));
        });
    },
    resetPassword() {
      this.forgotPassword(this.member.email);
    }
  }
};
</script>
