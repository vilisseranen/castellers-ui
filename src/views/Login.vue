<template>
  <div>
    <div class="box">
      <p class="title is-5">{{ $t('login.status') }}</p>
      <div v-if="authenticated" class="notification is-success">
        <strong>{{ $t('login.loggedIn') }}</strong>
        {{ $t('login.loggedInText') }}
      </div>
      <div v-else class="notification is-warning">
        <strong>{{ $t('login.notLoggedIn') }}</strong>
        {{ $t('login.notLoggedInText') }}
      </div>
    </div>
    <login-form v-if="!authenticated"></login-form>
    <div class="box" v-if="authenticated">
      <p class="title is-5">{{ $t('login.now') }}</p>
      <div class="content">
        <p>{{ $t('login.loggedInInstructions') }}</p>
        <ul>
          <li>{{ $t('login.bookmarkSite') }}</li>
          <li>{{ $t('login.updateProfile') }}</li>
          <li>{{ $t('login.registerEvents') }}</li>
        </ul>
      </div>
    </div>
    <div class="box" v-if="authenticated">
      <p class="title is-5">{{ $t('login.autoconnect') }}</p>
      <PrettyCheck
        class="p-default p-curve"
        v-model="autoconnect"
      >
        <span v-if="autoconnectLabel==='yes'">{{ $t('login.autoconnectYes') }}</span>
        <span v-if="autoconnectLabel==='no'">{{ $t('login.autoconnectNo') }}</span>
      </PrettyCheck>
      <hr />
      <div slot="footer">
        <p>{{ $t('login.cookie_warning') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from '../components/LoginForm.vue'
import { mapGetters } from 'vuex'
import PrettyCheck from 'pretty-checkbox-vue/check'
import { cookieMixin } from '../mixins/cookies.js'

import 'pretty-checkbox/dist/pretty-checkbox.min.css'

export default {
  mixins: [cookieMixin],
  computed: {
    ...mapGetters(['uuid', 'code', 'type']),
    authenticated: function () {
      return this.uuid && this.code
    },
    autoconnectLabel: function () {
      return this.autoconnect ? 'yes' : 'no'
    }
  },
  data () {
    return {
      autoconnect: false
    }
  },
  watch: {
    autoconnect: function (val) {
      if (val) {
        this.setCookie('member', this.uuid, 365)
        this.setCookie('code', this.code, 365)
      } else {
        this.eraseCookie('member')
        this.eraseCookie('code')
      }
    }
  },
  components: {
    LoginForm,
    PrettyCheck
  },
  mounted () {
    var member = this.getCookie('member')
    var code = this.getCookie('code')
    if (member && code) {
      this.autoconnect = true
    }
  }
}
</script>
