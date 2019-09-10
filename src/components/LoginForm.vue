<template>
  <div>
    <h1>{{ $t('loginForm.howTo') }}</h1>
    <p>{{ $t('loginForm.howToDescription') }}</p>
    <form>
      <p>{{ $t('loginForm.id') }}</p><input type='text' value='335b9fba95a1578baa5a2b9560e3566f174ed3a7'/>
      <p>{{ $t('loginForm.code') }}</p><input type='text' value='335b9fba95a1'/>
      <button type='submit' @click.prevent="login">{{ $t('loginForm.loginButton') }}</button>
    </form>
  </div>
</template>

<script>
export default {
  methods: {
    login () {
      console.log('login in')
    }
  }
}

</script>
