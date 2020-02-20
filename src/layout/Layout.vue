<template>
  <div id="app">
    <!-- Banner with background -->
    <bannerLayout></bannerLayout>
    <section class="main-content columns">
      <div class="container column is-fluid" style="padding: 48px; margin: 0px;">
        <!-- This is the content of the page -->
        <router-view></router-view>
      </div>
    </section>
    <footerLayout></footerLayout>
  </div>
</template>

<script>
import BannerLayout from './BannerLayout.vue'
import FooterLayout from './FooterLayout.vue'

import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['type'])
  },
  components: {
    BannerLayout,
    FooterLayout
  }
}
</script>

<style>
</style>
