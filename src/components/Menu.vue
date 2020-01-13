<template>
  <div>
    <p class="menu-label is-hidden-touch is-hidden-mobile is-hidden-tablet-only">Menu</p>
    <ul class="menu-list is-hidden-mobile is-hidden-tablet-only">
      <li>
        <router-link to="/events" v-bind:class="{ 'is-active': routeName === 'events'}">
          <span class="icon">
            <i class="fa fa-calendar-check"></i>
          </span>
          {{ $t('routes.events') }}
        </router-link>
      </li>
      <li v-if="this.type==='admin'">
        <router-link to="/members" v-bind:class="{ 'is-active': routeName === 'members'}">
          <span class="icon">
            <i class="fa fa-address-card"></i>
          </span>
          {{ $t('routes.members') }}
        </router-link>
      </li>
    </ul>
    <div class="hero is-hidden-desktop">
      <nav class="tabs">
        <div class="container">
          <ul>
            <li v-bind:class="{ 'is-active': routeName === 'events'}">
              <router-link to="/events">
                <span class="icon">
                  <i class="fa fa-calendar-check"></i>
                </span>
              </router-link>
            </li>
            <li v-bind:class="{ 'is-active': routeName === 'members'}"  v-if="this.type==='admin'">
              <router-link to="/members">
                <span class="icon">
                  <i class="fa fa-address-card"></i>
                </span>
              </router-link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: String
  },
  computed: {
    routeName () {
      const { path } = this.$route
      return path.split('/')[1].toLowerCase()
    }
  }
}
</script>
