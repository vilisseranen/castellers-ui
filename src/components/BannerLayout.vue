<template>
  <div>
    <section class="hero is-medium" id="banner" style="position:relative">
      <div id="banner-overlay"></div>
      <!-- Hero head: will stick at the top -->
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
                <a class="navbar-item is-active">Mon Profil</a>
                <span class="navbar-item">
                  <a class="button is-primary is-inverted">
                    <span>Déconnection</span>
                  </a>
                </span>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <!-- Hero content: will be in the middle -->
      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title has-text-light">Castellers de Montréal</h1>
          <h2 class="subtitle has-text-white-ter has-text-weight-bold">Planification des évènements</h2>
        </div>
      </div>
    </section>

    <div class="hero is-hidden-desktop">
      <nav class="tabs">
        <div class="container">
          <ul>
            <li class="is-active">
              <a>Membres</a>
            </li>
            <li>
              <a>Évènements</a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </div>
</template>

<style lang="scss">
#banner {
  background: url(../assets/castells_bg_header.jpg) center / cover;
}

#banner-overlay {
  height: 100%;
  width: 100%;
  background-color: black;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.3;
}
</style>
