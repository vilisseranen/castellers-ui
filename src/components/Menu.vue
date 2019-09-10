<template>
  <div>
    <p class="menu-label is-hidden-touch is-hidden-mobile is-hidden-tablet-only">Menu</p>
    <ul class="menu-list is-hidden-mobile is-hidden-tablet-only">
      <li>
        <router-link to="/login" v-bind:class="{ 'is-active': routeName === 'login'}">
          <span class="icon">
            <i class="fa fa-table"></i>
          </span> Login
        </router-link>
      </li>
      <li>
        <router-link to="/events" v-bind:class="{ 'is-active': routeName === 'events'}">
          <span class="icon">
            <i class="fa fa-thermometer"></i>
          </span> {{ $t('routes.events') }}
        </router-link>
      </li>
      <li>
        <router-link to="/temp" v-bind:class="{ 'is-active': routeName === 'temp'}">
          <span class="icon">
            <i class="fa fa-thermometer"></i>
          </span> Temp
        </router-link>
      </li>
    </ul>
    <div class="hero is-hidden-desktop">
      <nav class="tabs">
        <div class="container">
          <ul>
            <li v-bind:class="{ 'is-active': routeName === 'login'}">
              <router-link to="/login">Login</router-link>
            </li>
            <li v-bind:class="{ 'is-active': routeName === 'events'}">
              <router-link to="/events">Temp</router-link>
            </li>
            <li v-bind:class="{ 'is-active': routeName === 'temp'}">
              <router-link to="/temp">Temp</router-link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    routeName () {
      const { path } = this.$route
      return path.split('/')[1].toLowerCase()
    }
  }
}
</script>
