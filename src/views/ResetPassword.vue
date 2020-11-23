<template>
  <div>
    <section class="hero">
      <div class="hero-body has-text-centered">
        <div class="container">
          <h1 class="title">
            {{ $t("login.resetPassword") }}
          </h1>
        </div>
      </div>
    </section>
    <div class="columns is-centered">
      <div class="column is-one-quarter">
        <form class="loginform">
          <div class="field">
            <label class="label">{{ $t("login.username") }}</label>
            <input
              class="input"
              type="text"
              :placeholder="$t('login.usernamePlaceholder')"
            />
          </div>
          <div class="field">
            <label class="label">{{ $t("login.password") }}</label>
            <input
              class="input"
              type="password"
              :placeholder="$t('login.passwordPlaceholder')"
            />
          </div>
          <div class="field">
            <label class="label">{{ $t("login.passwordConfirm") }}</label>
            <input
              class="input"
              type="password"
              :placeholder="$t('login.passwordPlaceholder')"
            />
          </div>
          <div class="field is-grouped is-grouped-right">
            <button
              class="button is-primary"
              type="submit"
              @click.prevent="login"
            >
              {{ $t("login.resetButton") }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script></script>
