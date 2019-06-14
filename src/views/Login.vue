<template>
  <div>
    <div class="box is-hidden-mobile">
      <div class="media">
        <article class="media-content">
          <h1>
            <strong>John Smith</strong>
            <small>@johnsmith</small>
            <small>31m</small>
          </h1>
          <div class="notification is-info" style="margin-top: 10px;">
            <div class="media-content">
              <div class="content">
                <p class="is-size-5">
                  Bulma is a modern CSS framework from @jgthms, based on Flexbox.
                  Using Bulma, we can describe our website's design using just classes.
                  <span class="emoticon">
                    ᕕ(
                    ᐛ )ᕗ
                  </span>
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
    <div class="card">
      <div class="card-content">
        <div class="media">
          <div class="media-left">
            <figure class="image is-48x48">
              <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
            </figure>
          </div>
          <div class="media-content">
            <p class="title is-4">John Smith</p>
            <p class="subtitle is-6">@johnsmith</p>
          </div>
        </div>

        <div class="content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Phasellus nec iaculis mauris.
          <a>@bulmaio</a>.
          <a href="#">#css</a>
          <a href="#">#responsive</a>
          <br>
          <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="columns is-multiline">
        <div class="column is-full is-hidden-mobile is-hidden-tablet-only">
          <div class="section">
            <h1 class="title is-3">Liste des pratiques</h1>
            <table class="table">
              <thead>
                <tr>
                  <th>Nom de la pratique</th>
                  <th>Date</th>
                  <th>Début</th>
                  <th>Fin</th>
                  <th>Actions</th>
                  <th>Participation</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                <tr class="has-background-success">
                  <td>Pratique hebdomadaire</td>
                  <td>21/05/2019</td>
                  <td>18:45</td>
                  <td>21:30</td>
                  <td>
                    <span class="icon has-text-info">
                      <i class="fas fa-edit"></i>
                    </span>
                    <span class="icon has-text-danger">
                      <i class="fas fa-trash"></i>
                    </span>
                  </td>
                  <td>
                    <span class="icon">
                      <i class="far fa-thumbs-up"></i>
                    </span>
                    <span class="icon">
                      <i class="far fa-thumbs-down"></i>
                    </span>
                  </td>
                  <td>3</td>
                </tr>
                <tr class="has-background-warning">
                  <td>Pratique hebdomadaire</td>
                  <td>28/05/2019</td>
                  <td>18:45</td>
                  <td>21:30</td>
                  <td>
                    <span class="icon has-text-info">
                      <i class="fas fa-edit"></i>
                    </span>
                    <span class="icon has-text-danger">
                      <i class="fas fa-trash"></i>
                    </span>
                  </td>
                  <td>
                    <span class="icon">
                      <i class="far fa-thumbs-up"></i>
                    </span>
                    <span class="icon">
                      <i class="far fa-thumbs-down"></i>
                    </span>
                  </td>
                  <td>5</td>
                </tr>
                <tr>
                  <td>Relais pour la vie - Parc Angrignon</td>
                  <td>31/05/2019</td>
                  <td>19:30</td>
                  <td>19:30</td>
                  <td>
                    <span class="icon has-text-info">
                      <i class="fas fa-edit"></i>
                    </span>
                    <span class="icon has-text-danger">
                      <i class="fas fa-trash"></i>
                    </span>
                  </td>
                  <td>
                    <span class="icon">
                      <i class="far fa-thumbs-up"></i>
                    </span>
                    <span class="icon">
                      <i class="far fa-thumbs-down"></i>
                    </span>
                  </td>
                  <td>3</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="column">
          <div class="card">
            <header class="card-header has-background-success">
              <p class="card-header-title">
                Pratique hebdomadaire
                <br>
                <small>
                  <time datetime="2019-05-21">21/05/2019</time>
                </small>
              </p>
            </header>
            <div class="card-content">
              <div class="content">Pratique hebdomadaire à Brébeuf. Vu par un admin</div>
            </div>
            <footer class="card-footer">
              <a href="#" class="card-footer-item">
                <span class="icon has-text-info">
                  <i class="fas fa-edit"></i>
                </span>
              </a>
              <a href="#" class="card-footer-item">
                <span class="icon has-text-danger">
                  <i class="fas fa-trash"></i>
                </span>
              </a>
              <a href="#" class="card-footer-item">
                <span class="icon">
                  <i class="far fa-thumbs-up"></i>
                </span>
              </a>
              <a href="#" class="card-footer-item">
                <span class="icon">
                  <i class="far fa-thumbs-down"></i>
                </span>
              </a>
            </footer>
          </div>
        </div>
        <div class="column">
          <div class="card">
            <header class="card-header has-background-warning">
              <p class="card-header-title">Pratique hebdomadaire</p>
            </header>
            <div class="card-content">
              <div class="content">
                Pratique hebdomadaire à Brébeuf. Vu par un membre.
                <br>
                <time datetime="2019-05-28">28/05/2019</time>
              </div>
            </div>
            <footer class="card-footer">
              <a href="#" class="card-footer-item">
                <span class="icon">
                  <i class="far fa-thumbs-up"></i>
                </span>
              </a>
              <a href="#" class="card-footer-item">
                <span class="icon">
                  <i class="far fa-thumbs-down"></i>
                </span>
              </a>
            </footer>
          </div>
        </div>
        <div class="column">
          <div class="box">
            <article class="media">
              <div class="media-content">
                <div class="content">
                  <p>
                    <strong>Pratique hebdomadaire</strong>
                    <br>
                    <small>Collège Brébeuf</small>
                    <small>29/05/2019</small>
                    <br>Notre pratique hebdomadaire.
                    <br>
                    <span class="tag is-danger">Je ne viens pas</span>
                    <span class="tag is-info">Pratique</span>
                    <br>
                  </p>
                </div>
                <nav class="level is-mobile">
                  <div class="level-left">
                    <a href="#" class="level-item">
                      <span class="icon has-text-info">
                        <i class="fas fa-edit"></i>
                      </span>
                    </a>
                    <a href="#" class="level-item">
                      <span class="icon has-text-danger">
                        <i class="fas fa-trash"></i>
                      </span>
                    </a>
                    <a href="#" class="level-item">
                      <span class="icon">
                        <i class="far fa-thumbs-up"></i>
                      </span>
                    </a>
                    <a href="#" class="level-item">
                      <span class="icon">
                        <i class="far fa-thumbs-down"></i>
                      </span>
                    </a>
                  </div>
                </nav>
              </div>
            </article>
          </div>
        </div>
        <div class="column">
          <div class="box">
            <article class="media">
              <div class="media-content">
                <div class="content">
                  <p>
                    <strong>Relais pour la vie</strong>
                    <br>
                    <small>Parc Angrignon</small>
                    <small>31/05/2019</small>
                    <br>On présente dans un parc de Montréal pour la bonne cause !
                    <br>
                    <span class="tag is-success">Je viens</span>
                    <span class="tag is-warning">Présentation</span>
                    <br>
                  </p>
                </div>
                <nav class="level is-mobile">
                  <div class="level-left">
                    <a href="#" class="level-item">
                      <span class="icon has-text-info">
                        <i class="fas fa-edit"></i>
                      </span>
                    </a>
                    <a href="#" class="level-item">
                      <span class="icon has-text-danger">
                        <i class="fas fa-trash"></i>
                      </span>
                    </a>
                    <a href="#" class="level-item">
                      <span class="icon">
                        <i class="far fa-thumbs-up"></i>
                      </span>
                    </a>
                    <a href="#" class="level-item">
                      <span class="icon">
                        <i class="far fa-thumbs-down"></i>
                      </span>
                    </a>
                  </div>
                </nav>
              </div>
            </article>
          </div>
        </div>
        <div class="column">
          <div class="box">
            <article class="media">
              <div class="media-content">
                <div class="content">
                  <p>
                    <strong>Relais pour la vie</strong>
                    <br>
                    <small>Parc Angrignon</small>
                    <small>31/05/2019</small>
                    <br>On présente dans un parc de Montréal pour la bonne cause !
                    <br>
                    <span class="tag is-warning">Présentation</span>
                  </p>
                </div>
                <nav class="level is-mobile">
                  <div class="level-left">
                    <a href="#" class="level-item">
                      <span class="icon has-text-info">
                        <i class="fas fa-edit"></i>
                      </span>
                    </a>
                    <a href="#" class="level-item">
                      <span class="icon has-text-danger">
                        <i class="fas fa-trash"></i>
                      </span>
                    </a>
                    <a href="#" class="level-item">
                      <span class="icon">
                        <i class="far fa-thumbs-up"></i>
                      </span>
                    </a>
                    <a href="#" class="level-item">
                      <span class="icon">
                        <i class="far fa-thumbs-down"></i>
                      </span>
                    </a>
                  </div>
                </nav>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
