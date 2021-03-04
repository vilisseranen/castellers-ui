<template>
  <div>
    <b-navbar fixed-top type="is-beige">
      <template slot="brand">
        <b-navbar-item tag="div">
          <img
            src="/static/icons/icon-72x72.png"
            alt="logo Castellers de Montreal"
          />
          <strong id="menuTitle">{{ $t("bannerLayout.title") }}</strong>
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item tag="router-link" to="/events">
          <span class="icon">
            <i class="fa fa-calendar-check"></i>
          </span>
          <span>
            {{ $t("routes.events") }}
          </span>
        </b-navbar-item>
        <b-navbar-item
          tag="router-link"
          to="/members"
          v-if="this.type === 'admin'"
        >
          <span class="icon">
            <i class="fa fa-address-card"></i>
          </span>
          <span>
            {{ $t("routes.members") }}
          </span>
        </b-navbar-item>
        <b-navbar-item
          tag="router-link"
          to="/summary"
          v-if="this.type === 'admin'"
        >
          <span class="icon">
            <i class="fa fa-table"></i>
          </span>
          <span>
            {{ $t("routes.summary") }}
          </span>
        </b-navbar-item>
      </template>
      <template slot="end">
        <b-navbar-item tag="div">
          <div class="buttons">
            <router-link
              v-if="!this.uuid"
              class="button is-primary"
              :to="{ name: 'Login' }"
            >
              <strong>{{ $t("bannerLayout.connect") }}</strong>
            </router-link>
            <router-link
              v-if="this.uuid"
              class="button is-info"
              :to="{ name: 'MemberEdit', params: { uuid: uuid } }"
              ><strong>{{ $t("bannerLayout.profile") }}</strong></router-link
            >
            <a v-on:click="logout()" class="button is-primary" v-if="this.uuid">
              <strong>{{ $t("bannerLayout.disconnect") }}</strong>
            </a>
          </div>
        </b-navbar-item>
      </template>
    </b-navbar>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters(["uuid", "type"]),
    routeName() {
      const { path } = this.$route;
      return path.split("/")[1].toLowerCase();
    }
  },
  methods: {
    ...mapActions({
      resetState: "logout"
    }),
    logout() {
      this.resetState();
      if (this.$route.name === "Events") {
        this.$router.go();
      } else {
        this.$router.push({ name: "Events" });
      }
    }
  }
};
</script>
