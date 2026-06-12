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

  const movieResponse =
    await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=it-IT&query=${encodeURIComponent(query)}`
    );

  const movieData =
    await movieResponse.json();

  if(movieData.results?.length){

    return movieData.results;

  }

  const personResponse =
    await fetch(
      `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&language=it-IT&query=${encodeURIComponent(query)}`
    );

  const personData =
    await personResponse.json();

  if(
    !personData.results?.length
  ){

    return [];

  }

  const knownFor =
    personData.results[0]
      .known_for
      ?.filter(
        item =>
          item.media_type ===
          "movie"
      );

  return knownFor || [];

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
<div id="userReviewsSection"></div>

    </div>

  `;

  localStorage.setItem(
    "paneacult_selected_movie",
    JSON.stringify(movie)
  );

   checkPaneaReview(
  movie.id
);
loadCommunityReviews(
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

    const results =
  await searchMovies(query);

    movieResults.innerHTML = "";
    movieResults.style.display =
      "block";

    results
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


async function toggleMovieStatus(status){
   
const {
    data:{ user }
  } =
  await supabaseClient.auth.getUser();

  if(
    !user ||
    !selectedMovieData
  ) return;

  const movieId =
    selectedMovieData.id;
   
const {
  data: existing
} =
await supabaseClient
  .from("user_movies")
  .select("id")
  .eq("user_id", user.id)
  .eq("movie_id", movieId)
  .eq("status", status)
  .maybeSingle();
   
const {
  data: watchedExists
} =
await supabaseClient
  .from("user_movies")
  .select("id")
  .eq("user_id", user.id)
  .eq("movie_id", movieId)
  .eq("status", "watched")
  .maybeSingle();

if(
  status === "watched" &&
  watchedExists
){

  await supabaseClient
    .from("user_movies")
    .delete()
    .eq("id", watchedExists.id);

  await loadMovieStatuses();

  return;
}
  /* WATCHLIST */

  if(status === "watchlist"){

  if(existing){

    await supabaseClient
      .from("user_movies")
      .delete()
      .eq("id", existing.id);

    await loadMovieStatuses();
    return;
  }

  await supabaseClient
    .from("user_movies")
    .delete()
    .eq("user_id", user.id)
    .eq("movie_id", movieId)
    .eq("status", "watched");

  await supabaseClient
    .from("user_movies")
    .insert({
  user_id:user.id,
  movie_id:movieId,
  title:selectedMovieData.title,
  poster_path:selectedMovieData.poster_path,

  genre:
    selectedMovieData.genres
      ?.map(g => g.name)
      .join(", ") || "",

  release_year:
    Number(
      selectedMovieData.release_date?.slice(0,4)
    ) || null,

  status:"watchlist"
});

  await loadMovieStatuses();
  return;
  }
   
  /* WATCHED */
if(status === "watched"){

  if(existing){

    await supabaseClient
      .from("user_movies")
      .delete()
      .eq("id", existing.id);

    await loadMovieStatuses();
    return;
  }

  await supabaseClient
    .from("user_movies")
    .delete()
    .eq("user_id", user.id)
    .eq("movie_id", movieId)
    .eq("status", "watchlist");

  await supabaseClient
    .from("user_movies")
    .insert({
  user_id:user.id,
  movie_id:movieId,
  title:selectedMovieData.title,
  poster_path:selectedMovieData.poster_path,

  genre:
    selectedMovieData.genres
      ?.map(g => g.name)
      .join(", ") || "",

  release_year:
    Number(
      selectedMovieData.release_date?.slice(0,4)
    ) || null,

  status:"watchlist"
});

  await loadMovieStatuses();
  return;
}
   
  /* FAVORITE */

if(existing){

  await supabaseClient
    .from("user_movies")
    .delete()
    .eq("id", existing.id);

  await loadMovieStatuses();
  return;
}
   
  if(status === "favorite"){

    await supabaseClient
      .from("user_movies")
      .delete()
      .eq("user_id", user.id)
      .eq("movie_id", movieId)
      .eq("status", "watchlist");

    const {
      data: watchedExists
    } =
    await supabaseClient
      .from("user_movies")
      .select("id")
      .eq("user_id", user.id)
      .eq("movie_id", movieId)
      .eq("status", "watched")
      .maybeSingle();

    if(!watchedExists){

      await supabaseClient
        .from("user_movies")
        .insert({
  user_id:user.id,
  movie_id:movieId,
  title:selectedMovieData.title,
  poster_path:selectedMovieData.poster_path,

  genre:
    selectedMovieData.genres
      ?.map(g => g.name)
      .join(", ") || "",

  release_year:
    Number(
      selectedMovieData.release_date?.slice(0,4)
    ) || null,

  status:"watchlist"
});

    }

    const {
      data: favoriteExists
    } =
    await supabaseClient
      .from("user_movies")
      .select("id")
      .eq("user_id", user.id)
      .eq("movie_id", movieId)
      .eq("status", "favorite")
      .maybeSingle();

    if(!favoriteExists){

      await supabaseClient
        .from("user_movies")
        .insert({
  user_id:user.id,
  movie_id:movieId,
  title:selectedMovieData.title,
  poster_path:selectedMovieData.poster_path,

  genre:
    selectedMovieData.genres
      ?.map(g => g.name)
      .join(", ") || "",

  release_year:
    Number(
      selectedMovieData.release_date?.slice(0,4)
    ) || null,

  status:"watchlist"
});

    }

  }

  /* DESERT */

   if(existing){

  await supabaseClient
    .from("user_movies")
    .delete()
    .eq("id", existing.id);

  await loadMovieStatuses();
  return;
   }

  if(status === "desert"){

    await supabaseClient
      .from("user_movies")
      .delete()
      .eq("user_id", user.id)
      .eq("status", "desert");

    const statuses =
      ["watched","favorite"];

    for(const s of statuses){

      const {
        data: exists
      } =
      await supabaseClient
        .from("user_movies")
        .select("id")
        .eq("user_id", user.id)
        .eq("movie_id", movieId)
        .eq("status", s)
        .maybeSingle();

      if(!exists){

        await supabaseClient
          .from("user_movies")
      .insert({
  user_id:user.id,
  movie_id:movieId,
  title:selectedMovieData.title,
  poster_path:selectedMovieData.poster_path,

  genre:
    selectedMovieData.genres
      ?.map(g => g.name)
      .join(", ") || "",

  release_year:
    Number(
      selectedMovieData.release_date?.slice(0,4)
    ) || null,

  status:"watchlist"
});

      }

    }

    await supabaseClient
      .from("user_movies")
      .insert({
        user_id:user.id,
        movie_id:movieId,
        title:selectedMovieData.title,
        poster_path:selectedMovieData.poster_path,
        status:"desert"
      });

  }
await loadMovieStatuses();

}
async function loadMovieStatuses(){

  const {
    data:{ user }
  } =
  await supabaseClient.auth
    .getUser();

  if(
    !user ||
    !selectedMovieData
  ) return;

  const {
    data
  } =
  await supabaseClient
    .from("user_movies")
    .select("status")
    .eq(
      "user_id",
      user.id
    )
    .eq(
      "movie_id",
      selectedMovieData.id
    );

  document
    .getElementById(
      "markWatchlistBtn"
    )
    ?.classList.toggle(
      "active",
      data?.some(
        x =>
          x.status ===
          "watchlist"
      )
    );

  document
    .getElementById(
      "markWatchedBtn"
    )
    ?.classList.toggle(
      "active",
      data?.some(
        x =>
          x.status ===
          "watched"
      )
    );

  document
    .getElementById(
      "markLovedBtn"
    )
    ?.classList.toggle(
      "active",
      data?.some(
        x =>
          x.status ===
          "favorite"
      )
    );

  document
    .getElementById(
      "markDesertBtn"
    )
    ?.classList.toggle(
      "active",
      data?.some(
        x =>
          x.status ===
          "desert"
      )
    );

}


function setupMovieButtons(){

  const watchlistBtn =
  document.getElementById(
    "markWatchlistBtn"
  );

if(watchlistBtn){
  watchlistBtn.onclick =
    () => toggleMovieStatus(
      "watchlist"
    );
}

const watchedBtn =
  document.getElementById(
    "markWatchedBtn"
  );

if(watchedBtn){
  watchedBtn.onclick =
    () => toggleMovieStatus(
      "watched"
    );
}

const lovedBtn =
  document.getElementById(
    "markLovedBtn"
  );

if(lovedBtn){
  lovedBtn.onclick =
    () => toggleMovieStatus(
      "favorite"
    );
}

const desertBtn =
  document.getElementById(
    "markDesertBtn"
  );

if(desertBtn){
  desertBtn.onclick =
    () => toggleMovieStatus(
      "desert"
    );
}

 const writeReviewBtn =
  document.getElementById(
    "writeReviewBtn"
  );

if(writeReviewBtn){

  writeReviewBtn.onclick = () => {

    reviewForm?.classList.remove(
      "hidden-review-form"
    );

    reviewForm?.scrollIntoView({
      behavior:"smooth"
    });

  };

}

loadMovieStatuses();

} 


async function checkPaneaReview(movieId){

  const btn =
    document.getElementById(
      "paneaReviewBtn"
    );

  if(
    !btn ||
    !movieId
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
      movieId
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

async function loadCommunityReviews(movieId){

  const section =
    document.getElementById(
      "userReviewsSection"
    );

  if(!section) return;

  const {
    data: reviews,
    error
  } =
  await supabaseClient
    .from("user_reviews")
    .select("*")
    .eq("movie_id", movieId)
    .order(
      "created_at",
      {
        ascending:false
      }
    );

  if(
    error ||
    !reviews?.length
  ){

    section.innerHTML = "";

    return;

  }

  section.innerHTML = `

    <section class="community-section">

      <h2 class="community-title">
        Recensioni della community
      </h2>

      <div class="community-grid">

        ${reviews.map(review => `

          <article
            class="community-card"
          >

            <strong>
              @${review.username}
            </strong>

            <div>
              ${review.rating || "-"} ★
            </div>

            <p>
              ${
                review.review_text ||
                "Ha lasciato solo un voto."
              }
            </p>

          </article>

        `).join("")}

      </div>

    </section>

  `;

}

