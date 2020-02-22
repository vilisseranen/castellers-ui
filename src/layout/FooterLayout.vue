<template>
  <footer class="footer">
    <div class="columns">
      <div class="column buttons has-addons">
        <a
          v-bind:class="[
            this.$i18n.locale == 'fr' ? 'button is-focused' : 'button'
          ]"
          v-on:click="changeLanguage('fr')"
          >Français</a
        >
        <a
          v-bind:class="[
            this.$i18n.locale == 'en' ? 'button is-focused' : 'button'
          ]"
          v-on:click="changeLanguage('en')"
          >English</a
        >
        <a
          v-bind:class="[
            this.$i18n.locale == 'cat' ? 'button is-focused' : 'button'
          ]"
          v-on:click="changeLanguage('cat')"
          >Català</a
        >
      </div>
      <div class="column has-text-right">
        <p>
          {{ $t("general.forCastellers")
          }}<a href="https://github.com/vilisseranen">Clément Contini</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  methods: {
    changeLanguage: function(lang) {
      this.$root.setLocale(lang);
    }
  }
};
</script>
