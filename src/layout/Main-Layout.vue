<template>
  <div id="app">
    <div id="wrapper">
      <!-- Banner with background -->
      <bannerLayout></bannerLayout>
      <div id="middle" class="container columns is-fluid is-centered">
        <section class="main-content column">
          <!-- This is the content of the page -->
          <router-view></router-view>
        </section>
      </div>
    </div>
    <footerLayout></footerLayout>
  </div>
</template>

<script>
import BannerLayout from "./Banner-Layout.vue";
import FooterLayout from "./Footer-Layout.vue";

import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["type"]),
  },
  components: {
    BannerLayout,
    FooterLayout,
  },
};
</script>

<style></style>
