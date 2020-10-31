<template>
  <div id="app">
    <div id="wrapper">
      <!-- Banner with background -->
      <bannerLayout></bannerLayout>
      <div id="middle" class="container columns is-fluid tosefsef">
        <section class="main-content columns sfse">
          <!-- This is the content of the page -->
          <router-view></router-view>
        </section>
      </div>
    </div>
    <footerLayout></footerLayout>
  </div>
</template>

<script>
import BannerLayout from "./BannerLayout.vue";
import FooterLayout from "./FooterLayout.vue";

import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["type"])
  },
  components: {
    BannerLayout,
    FooterLayout
  }
};
</script>

<style></style>
