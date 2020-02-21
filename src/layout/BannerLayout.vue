<template>
  <div>
    <b-navbar fixed-top type="is-beige">
       <template slot="brand">
            <b-navbar-item tag="div">
                <img
                    src="static/icons/icon-72x72.png"
                    alt="logo Castellers de Montreal"
                >
                <strong id="menuTitle">{{ $t('bannerLayout.title') }}</strong>
            </b-navbar-item>
        </template>
        <template slot="start">
            <b-navbar-item tag="router-link" to="/events">
                <span class="icon">
                  <i class="fa fa-calendar-check"></i>
                </span>
                <span>
                  {{ $t('routes.events') }}
                </span>
            </b-navbar-item>
            <b-navbar-item tag="router-link" to="/members">
              <span class="icon">
                <i class="fa fa-address-card"></i>
              </span>
              <span>
                {{ $t('routes.members') }}
              </span>
            </b-navbar-item>
        </template>
        <template slot="end">
          <b-navbar-item tag="div">
            <div class="buttons">
              <router-link v-if="!this.uuid" class="button is-primary" :to="{name: 'Login'}">
                <strong>{{ $t('bannerLayout.connect') }}</strong>
              </router-link>
              <router-link
                  v-if="this.uuid"
                  class="button is-info"
                  :to="{ name: 'MemberEdit', params: { uuid: uuid}}"
              ><strong>{{ $t('bannerLayout.profile') }}</strong></router-link>
              <a v-on:click="disconnect()" class="button is-primary" v-if="this.uuid">
                <strong>{{ $t('bannerLayout.disconnect') }}</strong>
              </a>
            </div>
          </b-navbar-item>
        </template>
    </b-navbar>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapGetters(['uuid', 'code', 'type']),
    routeName () {
      const { path } = this.$route
      return path.split('/')[1].toLowerCase()
    }
  },
  methods: {
    ...mapMutations({
      disconnect: 'disconnect'
    })
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
