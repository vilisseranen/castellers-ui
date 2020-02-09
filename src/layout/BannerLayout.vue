<template>
  <div>
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="https://bulma.io">
          <img src="static/icons/logo_oficial_512_512.jpg" width="30px" >
        </a>

        <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <!-- <div id="navbarBasicExample" class="navbar-menu">
        <div class="navbar-start">
          <a class="navbar-item">
            Home
          </a>

          <a class="navbar-item">
            Documentation
          </a>

          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              More
            </a>

            <div class="navbar-dropdown">
              <a class="navbar-item">
                About
              </a>
              <a class="navbar-item">
                Jobs
              </a>
              <a class="navbar-item">
                Contact
              </a>
              <hr class="navbar-divider">
              <a class="navbar-item">
                Report an issue
              </a>
            </div>
          </div>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <a class="button is-primary">
                <strong>Sign up</strong>
              </a>
              <a class="button is-light">
                Log in
              </a>
            </div>
          </div>
        </div>
      </div> -->
    </nav>

    <!-- <section class="hero is-medium" id="banner" style="position:relative">
      <div id="banner-overlay"></div>
      <div class="hero-head">
        <nav class="navbar">
          <div class="container">
            <div class="navbar-brand">
              <span class="navbar-burger burger" data-target="navbarMenuHeroA">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
            <div id="navbarMenuHeroA" class="navbar-menu">
              <div class="navbar-end">
                <router-link
                  v-if="this.uuid"
                  class="navbar-item is-active"
                  :to="{ name: 'MemberEdit', params: { uuid: uuid}}"
                >{{ $t('bannerLayout.profile') }}</router-link>
                <span class="navbar-item" v-if="this.uuid">
                  <a v-on:click="disconnect()" class="button is-success is-inverted">
                    <span>{{ $t('bannerLayout.disconnect') }}</span>
                  </a>
                </span>
                <span class="navbar-item" v-if="!this.uuid">
                  <router-link class="button is-primary is-inverted" :to="{name: 'Login'}">
                    <span>{{ $t('bannerLayout.connect') }}</span>
                  </router-link>
                </span>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title has-text-light">{{ $t('bannerLayout.title') }}</h1>
          <h2
            class="subtitle has-text-white-ter has-text-weight-bold"
          >{{ $t('bannerLayout.subtitle') }}</h2>
        </div>
      </div>
    </section> -->
    <Menu class="hero is-hidden-desktop" :type="type"></Menu>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

import Menu from '../components/Menu.vue'

export default {
  computed: {
    ...mapGetters(['uuid', 'code', 'type'])
  },
  methods: {
    ...mapMutations({
      disconnect: 'disconnect'
    })
  },
  components: {
    Menu
  },
  mounted () {
    document.addEventListener('DOMContentLoaded', () => {
      // Get all "navbar-burger" elements
      const $navbarBurgers = Array.prototype.slice.call(
        document.querySelectorAll('.navbar-burger'),
        0
      )
      // Check if there are any navbar burgers
      if ($navbarBurgers.length > 0) {
        // Add a click event on each of them
        $navbarBurgers.forEach(el => {
          el.addEventListener('click', () => {
            // Get the target from the "data-target" attribute
            const target = el.dataset.target
            const $target = document.getElementById(target)

            // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
            el.classList.toggle('is-active')
            $target.classList.toggle('is-active')
          })
        })
      }
    })
  }
}
</script>
