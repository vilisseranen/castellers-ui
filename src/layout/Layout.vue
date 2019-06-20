<template>
  <div id="app">
    <!-- Banner with background -->
    <bannerLayout></bannerLayout>
    <section class="main-content columns">
      <!-- Menu on the left on desktop -->
      <aside
        class="section column is-one-fifth-desktop is-fullheight is-hidden-mobile is-hidden-tablet-only"
      >
        <Menu></Menu>
      </aside>
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
import Menu from '../components/Menu.vue'

export default {
  components: {
    BannerLayout,
    FooterLayout,
    Menu
  }
}
</script>

<style>
</style>
