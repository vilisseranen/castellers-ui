<template>
  <div class="box">
    <p class="title is-4">{{ $t("login.howTo") }}</p>
    <p class="subtitle is-6">{{ $t("login.howToDescription") }}</p>
    <form>
      <div class="field">
        <label class="label">{{ $t("login.id") }}</label>
        <input
          class="input"
          type="text"
          placeholder="335b9fba95a1578baa5a2b9560e3566f174ed3a7"
          v-model="member.uuid"
        />
      </div>
      <div class="field">
        <label class="label">{{ $t("login.code") }}</label>
        <input
          class="input"
          type="password"
          placeholder="335b9fba95a1"
          v-model="member.code"
        />
      </div>
      <div class="field is-grouped is-grouped-right">
        <button class="button is-primary" type="submit" @click.prevent="login">
          {{ $t("login.loginButton") }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import axios from "axios";

export default {
  data() {
    return {
      member: {}
    };
  },
  methods: {
    ...mapMutations({
      authenticate: "authenticate"
    }),
    login() {
      var self = this;
      axios
        .get("/api/members/" + this.member.uuid, {
          headers: { "X-Member-Code": this.member.code }
        })
        .then(function(response) {
          self.member.type = response.data.type;
          self.authenticate(self.member);
          self.$root.setLocale(response.data.language);
        })
        .catch(err => {
          console.log(err);
          self.$notifyNOK(self.$t("login.notifyError"));
        });
    }
  }
};
</script>
