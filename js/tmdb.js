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


async function searchMovies(query){

  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=it-IT&query=${encodeURIComponent(query)}`
  );

  const data =
    await response.json();

  return data.results || [];

}


async function fetchMovieDetails(movieId){

  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=it-IT&append_to_response=credits`
  );

  const movieData =
    await response.json();

  /* IMDb */

  const omdbResponse =
    await fetch(
      `https://www.omdbapi.com/?apikey=86e58e8e&i=${movieData.imdb_id}`
    );

  const omdbData =
    await omdbResponse.json();

  movieData.imdb_rating =
    omdbData.imdbRating || "";

  movieData.imdb_votes =
    omdbData.imdbVotes || "";

  return movieData;

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

  selectedMovieData =
  movieDetails || movie;

   /* RECENT ACTIVITY */

let recent =
  JSON.parse(
    localStorage.getItem(
      "paneacult_recent"
    )
  ) || [];

recent =
  recent.filter(
    m => m.id !== selectedMovieData.id
  );

recent.unshift(
  selectedMovieData
);

recent =
  recent.slice(0,10);

localStorage.setItem(
  "paneacult_recent",
  JSON.stringify(recent)
);

   
const hero =
  document.querySelector(
    ".profile-hero"
  );

if(hero && movie.backdrop_path){

  hero.style.backgroundImage =
    `
    linear-gradient(
      rgba(7,15,25,.78),
      rgba(7,15,25,.95)
    ),
    url(https://image.tmdb.org/t/p/original${movie.backdrop_path})
    `;

  hero.style.backgroundSize =
    "cover";

  hero.style.backgroundPosition =
    "center";

}
  selectedMovie.innerHTML = `

    <div class="selected-movie-card">

      <img
  src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
  alt="${movie.title}"
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

<a
  href="#"
  class="movie-action-btn panea-review-btn"
  id="paneaReviewBtn"
  style="display:none"
>
  ✦ Leggi recensione paneacult
</a>

  <button
    class="movie-action-btn watchlist-btn"
    id="markWatchlistBtn"
  >
    🎬 Watchlist
  </button>

  <button
    class="movie-action-btn watched-btn"
    id="markWatchedBtn"
  >
    👁 Watched
  </button>

  <button
    class="movie-action-btn love-btn"
    id="markLovedBtn"
  >
    ❤️ Adorato
  </button>

  <button
    class="movie-action-btn desert-btn"
    id="markDesertBtn"
  >
    🌴 Desert Island
  </button>

  <button
    class="movie-action-btn review-btn"
    id="writeReviewBtn"
  >
    ✍ Scrivi recensione o vota
  </button>
</div>

    </div>

  `;

  localStorage.setItem(
    "paneacult_selected_movie",
    JSON.stringify(movie)
  );

   checkPaneaReview(
  movie.id
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
movieResults.style.display =
  "block";
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

movieResults.style.display =
  "none";

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
movieResults.style.display =
  "block";
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
      movieResults.style.display =
        "none";

      return;

    }

    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=it-IT&query=${encodeURIComponent(query)}`
    );

    const data =
      await response.json();

    movieResults.innerHTML = "";
    movieResults.style.display =
      "block";

    data.results
      .slice(0,5)
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
            <h3>${movie.title}</h3>
            <p>
              ${movie.release_date?.slice(0,4) || ""}
            </p>
          </div>
        `;

        div.addEventListener(
          "click",
          async () => {

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
            movieResults.style.display =
              "none";

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



function goToMovie(id){

  if(!id) return;

  window.location.href =
    `add-review.html?id=${id}`;

}


function openRating(id){

  window.location.href =
    `add-review.html?id=${id}`;

}

function setupMovieButtons(){

  const watchlistBtn =
    document.getElementById(
      "markWatchlistBtn"
    );

  const watchedBtn =
    document.getElementById(
      "markWatchedBtn"
    );

  const lovedBtn =
    document.getElementById(
      "markLovedBtn"
    );

  const desertBtn =
    document.getElementById(
      "markDesertBtn"
    );

  const reviewBtn =
    document.getElementById(
      "writeReviewBtn"
    );

/* ACTIVE STATE */

const watchlist =
  JSON.parse(
    localStorage.getItem(
      "paneacult_watchlist"
    )
  ) || [];

const watched =
  JSON.parse(
    localStorage.getItem(
      "paneacult_watched"
    )
  ) || [];

const favorites =
  JSON.parse(
    localStorage.getItem(
      "paneacult_favorites"
    )
  ) || [];

const desert =
  JSON.parse(
    localStorage.getItem(
      "paneacult_desert_island"
    )
  );

watchlistBtn?.classList.remove(
  "active"
);

watchedBtn?.classList.remove(
  "active"
);

lovedBtn?.classList.remove(
  "active"
);

desertBtn?.classList.remove(
  "active"
);

if(
  watchlist.find(
    m => m.id === selectedMovieData?.id
  )
){
  watchlistBtn?.classList.add(
    "active"
  );
}

if(
  watched.find(
    m => m.id === selectedMovieData?.id
  )
){
  watchedBtn?.classList.add(
    "active"
  );
}

if(
  favorites.find(
    m => m.id === selectedMovieData?.id
  )
){
  lovedBtn?.classList.add(
    "active"
  );
}

if(
  desert?.id ===
  selectedMovieData?.id
){
  desertBtn?.classList.add(
    "active"
  );
}
   

  watchlistBtn?.addEventListener(
    "click",
    () => {

      watchedBtn?.addEventListener(
  "click",
  async () => {

    const {
      data:{ user }
    } =
    await supabaseClient.auth
      .getUser();

    if(!user) return;

    const {
      data: existing
    } =
    await supabaseClient
      .from("user_movies")
      .select("id")
      .eq(
        "user_id",
        user.id
      )
      .eq(
        "movie_id",
        selectedMovieData.id
      )
      .eq(
        "status",
        "watched"
      )
      .maybeSingle();

    if(!existing){

      await supabaseClient
        .from("user_movies")
        .insert({

          user_id:
            user.id,

          movie_id:
            selectedMovieData.id,

          title:
            selectedMovieData.title,

          poster_path:
            selectedMovieData.poster_path,

          status:
            "watched"

        });

    }

    watchedBtn.classList.add(
      "active"
    );

    alert(
      "Segnato come watched 👁"
    );

  }
);
      if(
        !list.find(
          m => m.id === selectedMovieData.id
        )
      ){

        list.push(
          selectedMovieData
        );

        localStorage.setItem(
          "paneacult_watchlist",
          JSON.stringify(list)
        );
watchlistBtn.classList.add(
  "active"
);
      }

      alert(
        "Aggiunto alla watchlist 🎬"
      );

    }
  );

  watchedBtn?.addEventListener(
    "click",
    () => {

      const list =
        JSON.parse(
          localStorage.getItem(
            "paneacult_watched"
          )
        ) || [];

      if(
        !list.find(
          m => m.id === selectedMovieData.id
        )
      ){

        list.push(
          selectedMovieData
        );

        localStorage.setItem(
          "paneacult_watched",
          JSON.stringify(list)
        );
watchedBtn.classList.add(
  "active"
);
      }

      alert(
        "Segnato come watched 👁"
      );

    }
  );

  lovedBtn?.addEventListener(
    "click",
    () => {

      const list =
        JSON.parse(
          localStorage.getItem(
            "paneacult_favorites"
          )
        ) || [];
lovedBtn.classList.add(
  "active"
);
      if(
        !list.find(
          m => m.id === selectedMovieData.id
        )
      ){

        list.push(
          selectedMovieData
        );

        localStorage.setItem(
          "paneacult_favorites",
          JSON.stringify(list)
        );

      }

      alert(
        "Aggiunto ai Loved ❤️"
      );

    }
  );

  desertBtn?.addEventListener(
    "click",
    () => {

      localStorage.setItem(
        "paneacult_desert_island",
        JSON.stringify(
          selectedMovieData
        )
      );
desertBtn.classList.add(
  "active"
);
      alert(
        "Desert Island salvato 🌴"
      );

    }
  );

  reviewBtn?.addEventListener(
  "click",
  () => {

    reviewForm?.classList.remove(
      "hidden-review-form"
    );

    reviewForm?.scrollIntoView({
      behavior:"smooth",
      block:"start"
    });

  }
);

}





async function checkPaneaReview(){

  const btn =
    document.getElementById(
      "paneaReviewBtn"
    );

  if(
    !btn ||
    !movieDetails
  ) return;

  const {
    data,
    error
  } =
  await supabaseClient
    .from("reviews")
    .select("slug")
    .eq(
      "movie_id",
      movieDetails.id
    )
    .maybeSingle();

  if(
    error ||
    !data
  ) return;

  btn.style.display =
    "inline-flex";

  btn.href =
    `review.html?slug=${data.slug}`;
}
