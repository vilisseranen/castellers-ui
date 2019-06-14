<template>
  <div id="app">
    <!-- Banner with background -->
    <bannerLayout></bannerLayout>
    <section class="main-content columns">
      <!-- Menu on the left on desktop -->
      <menuLayout></menuLayout>
      <div class="container column is-fluid" style="padding: 48px; margin: 0px;">
        <!-- This is the content of the page -->
        <router-view></router-view>
      </div>
    </section>
    <footerLayout></footerLayout>
  </div>
</template>

<script>
import BannerLayout from '../components/BannerLayout.vue'
import MenuLayout from '../components/MenuLayout.vue'
import FooterLayout from '../components/FooterLayout.vue'

export default {
  components: {
    BannerLayout,
    MenuLayout,
    FooterLayout
  }
}
</script>
