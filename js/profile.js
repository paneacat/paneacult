const API_KEY = "LA_TUA_API_KEY";

const TMDB_IMAGE =
  "https://image.tmdb.org/t/p/w500";

const watchlistGrid =
  document.getElementById("watchlistGrid");

/* =========================
   LOAD MOVIES
========================= */

async function loadMovies(){

  const response = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=it-IT&page=1`
  );

  const data = await response.json();

  renderMovies(data.results);

}

/* =========================
   RENDER
========================= */

function renderMovies(movies){

  watchlistGrid.innerHTML =
    movies.map(movie => `

      <div class="saved-card">

        <img
          src="${TMDB_IMAGE + movie.poster_path}"
          alt="${movie.title}"
        >

        <div class="saved-overlay">

          <h3>${movie.title}</h3>

        </div>

      </div>

    `).join("");

}

/* =========================
   INIT
========================= */

loadMovies();
