/* =========================
   TMDB SEARCH
========================= */

const API_KEY =
  "3688d1b3985d41091da268200e1841ef";

const movieSearchInput =
  document.getElementById(
    "movieSearchInput"
  );

const movieResults =
  document.getElementById(
    "movieResults"
  );

const selectedMovie =
  document.getElementById(
    "selectedMovie"
  );

const reviewForm =
  document.getElementById(
    "reviewForm"
  );

let selectedMovieData = null;
let currentMovieStatus = null;


async function fetchMovieDetails(movieId){

  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=it-IT&append_to_response=credits`
  );

  return await response.json();

}

function renderSelectedMovie(movie, movieDetails){

  const director =
  movieDetails?.credits?.crew?.find(
    person => person.job === "Director"
  );

  const cast =
  movieDetails?.credits?.cast
      .slice(0, 4)
      .map(actor => actor.name)
      .join(", ");

  selectedMovieData = movie;

  selectedMovie.innerHTML = `

    <div class="selected-movie-card">

      <img
        src="https://image.tmdb.org/t/p/original${movie.backdrop_path}"
      >

      <div class="selected-movie-content">

        <p class="selected-movie-kicker">

          ${movieDetails.genres
            .map(g => g.name)
            .join(" • ")}

        </p>

        <h2>
          ${movie.title}
        </h2>

        <p class="selected-movie-year">
          ${movie.release_date?.slice(0,4) || ""}
        </p>

        <p class="selected-movie-overview">

          ${
            movie.overview
              ? movie.overview
              : "Nessuna sinossi disponibile."
          }

        </p>

        <div class="selected-movie-meta">

          <p>
            <strong>Regia:</strong>
            ${director?.name || "-"}
          </p>

          <p>
            <strong>Cast:</strong>
            ${cast}
          </p>

          <p>
            <strong>Durata:</strong>
            ${movieDetails.runtime || "-"} min
          </p>

        </div>

        <div class="movie-actions">

          <button
            class="movie-action-btn watched-btn"
            id="markWatchedBtn"
          >
            👁️ Visto
          </button>

          <button
            class="movie-action-btn watchlist-btn"
            id="markWatchlistBtn"
          >
            📌 Da vedere
          </button>

        </div>

      </div>

    </div>

  `;

  localStorage.setItem(
    "paneacult_selected_movie",
    JSON.stringify(movie)
  );

  localStorage.setItem(
    "paneacult_selected_movie_html",
    selectedMovie.innerHTML
  );

}

  
async function mostraFilmPopolari(){

  const response = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=it-IT`
  );

  const data =
    await response.json();

  movieResults.innerHTML = "";

  data.results
    .slice(0, 5)
    .forEach(movie => {

      const div =
        document.createElement("div");

      div.classList.add(
        "movie-result"
      );

      div.innerHTML = `
      
        <img
          src="https://image.tmdb.org/t/p/w200${movie.poster_path}"
          alt="${movie.title}"
        >

        <div>

          <h3>
            ${movie.title}
          </h3>

          <p>
            ${movie.release_date?.slice(0,4) || ""}
          </p>

        </div>

      `;

      
  div.addEventListener(
  "click",
  async () => {

    reviewForm.style.display =
      "block";

    const movieDetails =
      await fetchMovieDetails(
        movie.id
      );

    renderSelectedMovie(
      movie,
      movieDetails
    );

    setupMovieButtons();

    movieResults.innerHTML = "";

    movieSearchInput.value =
      movie.title;

  }
);

      movieResults.appendChild(div);

    });

}
if(movieSearchInput){
movieSearchInput.addEventListener(
  "focus",
  () => {

    mostraFilmPopolari();

  }
);
  movieSearchInput.addEventListener(
    "input",
    async () => {

      const query =
        movieSearchInput.value.trim();

      if(query.length < 2){

        movieResults.innerHTML = "";
        return;

      }

      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=it-IT&query=${query}`
      );

      const data =
        await response.json();

      movieResults.innerHTML = "";

      data.results
        .slice(0, 5)
        .forEach(movie => {

          const div =
            document.createElement("div");

          div.classList.add(
            "movie-result"
          );

          div.innerHTML = `
          
            <img
              src="https://image.tmdb.org/t/p/w200${movie.poster_path}"
              alt="${movie.title}"
            >

            <div>

              <h3>
                ${movie.title}
              </h3>

              <p>
                ${movie.release_date?.slice(0,4) || ""}
              </p>

            </div>

          `;

          
div.addEventListener(
  "click",
  async () => {

    reviewForm.style.display =
      "block";

    const movieDetails =
      await fetchMovieDetails(
        movie.id
      );

    renderSelectedMovie(
      movie,
      movieDetails
    );

    setupMovieButtons();

    movieResults.innerHTML = "";

    movieSearchInput.value =
      movie.title;

  }
);

          movieResults.appendChild(div);

        });

    }
  );

}



const TMDB_POSTER =
  "https://image.tmdb.org/t/p/w500";

const TMDB_BACKDROP =
  "https://image.tmdb.org/t/p/original";

const favoriteGrid =
  document.getElementById("favoriteGrid");

async function loadTrending(){

  const res = await fetch(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=LA_TUA_API_KEY`
  );

  const data = await res.json();

  renderMovies(data.results);

}

function renderMovies(movies){

  favoriteGrid.innerHTML =

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

loadTrending();
