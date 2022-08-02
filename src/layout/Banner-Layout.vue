<template>
  <nav
    class="navbar is-fixed-top has-shadow"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <a class="navbar-item" href="/">
        <img
          src="/static/icons/icon-72x72.png"
          width="28"
          height="28"
          alt="logo Castellers de Montreal"
        />
        <strong id="menuTitle">{{ $t("bannerLayout.title") }}</strong>
      </a>
      <a
        role="button"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarMain"
        :class="{ 'is-active': burgerActive }"
        @click="toggleBurger()"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div
      id="navbarMain"
      class="navbar-menu"
      :class="{ 'is-active': burgerActive }"
    >
      <div class="navbar-start">
        <router-link :to="{ name: 'Events' }" class="navbar-item">
          <span class="icon">
            <i class="fa fa-calendar-check"></i>
          </span>
          <span>
            {{ $t("routes.events") }}
          </span>
        </router-link>
        <router-link
          :to="{ name: 'Members' }"
          v-if="this.type === 'admin'"
          class="navbar-item"
        >
          <span class="icon">
            <i class="fa fa-address-card"></i>
          </span>
          <span>
            {{ $t("routes.members") }}
          </span>
        </router-link>
        <router-link
          :to="{ name: 'Summary' }"
          v-if="this.type === 'admin'"
          class="navbar-item"
        >
          <span class="icon">
            <i class="fa fa-table"></i>
          </span>
          <span>
            {{ $t("routes.summary") }}
          </span>
        </router-link>
        <router-link
          :to="{ name: 'Castells' }"
          v-if="this.type === 'admin'"
          class="navbar-item"
        >
          <span class="icon">
            <i class="fa fa-chess-rook"></i>
          </span>
          <span> Castells </span>
        </router-link>
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
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
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters(["uuid", "type"]),
    routeName() {
      const { path } = this.$route;
      return path.split("/")[1].toLowerCase();
    },
  },
  data: function () {
    return {
      burgerActive: false,
    };
  },
  methods: {
    ...mapActions({
      resetState: "logout",
    }),
    logout() {
      this.resetState();
      if (this.$route.name === "Events") {
        this.$router.go();
      } else {
        this.$router.push({ name: "Events" });
      }
    },
    toggleBurger() {
      this.burgerActive = !this.burgerActive;
    },
  },
};
</script>
