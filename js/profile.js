
/* =========================
   INIT
========================= */

loadMovies();


const logoutBtn =
  document.querySelector(
    ".logout-btn"
  );

logoutBtn?.addEventListener(
  "click",
  async () => {

    await supabaseClient.auth.signOut();

    window.location.href =
      "login.html";

  }
);



/* =========================
   PROFILE MOVIES
========================= */

const watchedGrid =
  document.getElementById(
    "watchedGrid"
  );

const watchlistGrid =
  document.getElementById(
    "watchlistGrid"
  );

const favoriteGrid =
  document.getElementById(
    "favoriteGrid"
  );

const currentFavorite =
  document.getElementById(
    "currentFavorite"
  );

const signatureGrid =
  document.getElementById(
    "signatureGrid"
  );

/* =========================
   LOAD MOVIES
========================= */

function getMovies(key){

  return JSON.parse(
    localStorage.getItem(key)
  ) || [];

}

const watched =
  getMovies(
    "paneacult_watched"
  );

const watchlist =
  getMovies(
    "paneacult_watchlist"
  );

const favorites =
  getMovies(
    "paneacult_favorites"
  );

/* =========================
   RENDER GRID
========================= */

function renderGrid(
  grid,
  movies
){

  if(!grid) return;

  if(movies.length === 0){

    grid.innerHTML = `
    
      <p class="empty-text">
        Nessun film ancora.
      </p>
    
    `;

    return;

  }

  grid.innerHTML =

    movies.map(movie => `

      <div class="saved-card">

        <img
          src="
          https://image.tmdb.org/t/p/w500${movie.poster_path}
          "
          alt="${movie.title}"
        >

        <div class="saved-overlay">

          <h3>
            ${movie.title}
          </h3>

        </div>

      </div>

    `).join("");

}

/* =========================
   CURRENT FAVORITE
========================= */

function renderCurrentFavorite(){

  if(
    !favorites.length ||
    !currentFavorite
  ) return;

  const movie =
    favorites[0];

  currentFavorite.innerHTML = `

    <img
      src="
      https://image.tmdb.org/t/p/original${movie.backdrop_path}
      "
      alt="${movie.title}"
    >

    <div class="current-favorite-content">

      <p class="current-label">
        CURRENT OBSESSION
      </p>

      <h3>
        ${movie.title}
      </h3>

      <span>
        uno dei tuoi film preferiti.
      </span>

    </div>

  `;

}

/* =========================
   SIGNATURE FILMS
========================= */

function renderSignature(){

  if(!signatureGrid) return;

  const movies =
    favorites.slice(0,3);

  signatureGrid.innerHTML =

    movies.map(movie => `

      <div class="signature-film">

        <img
          src="
          https://image.tmdb.org/t/p/original${movie.backdrop_path}
          "
          alt="${movie.title}"
        >

        <div class="signature-film-overlay">

          <h3>
            ${movie.title}
          </h3>

        </div>

      </div>

    `).join("");

}

/* =========================
   INIT
========================= */

renderGrid(
  watchedGrid,
  watched
);

renderGrid(
  watchlistGrid,
  watchlist
);

renderGrid(
  favoriteGrid,
  favorites
);

renderCurrentFavorite();

renderSignature();
