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

if (reviewForm) {
  reviewForm.classList.add("hidden-review-form");
}

let selectedMovieData = null;
let currentMovieStatus = null;

async function searchMovies(query){

  // PERSONE
  const personResponse =
    await fetch(
      `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&language=it-IT&query=${encodeURIComponent(query)}`
    );

  const personData =
    await personResponse.json();

  if(personData.results?.length){

    const personId =
  personData.results[0].id;

const creditsResponse =
  await fetch(
    `https://api.themoviedb.org/3/person/${personId}/movie_credits?api_key=${API_KEY}&language=it-IT`
  );

const creditsData =
  await creditsResponse.json();

const directedMovies =
  creditsData.crew
    .filter(
      movie =>
        movie.job === "Director"
    )
    .sort(
      (a,b) =>
        (b.release_date || "")
          .localeCompare(
            a.release_date || ""
          )
    );

if(directedMovies.length){
  return directedMovies;
}

  }

  // FILM
  const movieResponse =
  await fetch(
    `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=it-IT&query=${encodeURIComponent(query)}`
  );

   
  const movieData =
    await movieResponse.json();

  return movieData.results.filter(
  item =>
    item.media_type === "movie" ||
    item.media_type === "tv"
);

}
   

async function fetchMovieDetails(
  movieId,
  mediaType = "movie"
){
   
  const response = await fetch(
`https://api.themoviedb.org/3/${mediaType}/${movieId}?api_key=${API_KEY}&language=it-IT&append_to_response=credits`
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

  selectedMovieData = {
  ...movieDetails,
  media_type: movie.media_type,
  id: movie.id
};

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

   const title =
  movie.title || movie.name;

const year =
  (movie.release_date || movie.first_air_date || "").slice(0,4);

const mediaType =
  movie.media_type === "tv"
    ? "📺 Serie TV"
    : "🎬 Film";

   const directorLabel =
  movie.media_type === "tv"
    ? "Creatore"
    : "Regia";

const runtimeLabel =
  movie.media_type === "tv"
    ? "Stagioni"
    : "Durata";

const runtimeValue =
  movie.media_type === "tv"
    ? (movieDetails.number_of_seasons || "-")
    : ((movieDetails.runtime || "-") + " min");

   
  selectedMovie.innerHTML = `

    <div class="selected-movie-card">

      <img
  src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
  alt="${title}"
>

      <div class="selected-movie-content">

        <p class="selected-movie-kicker">

          ${movieDetails.genres
            .map(g => g.name)
            .join(" • ")}

        </p>

        <h2>
          ${title}
        </h2>

        <p class="selected-movie-year">
          ${mediaType} • ${year}
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
            <strong>${directorLabel}:</strong>
            ${director?.name || "-"}
          </p>

          <p>
            <strong>Cast:</strong>
            ${cast}
          </p>

          <p>
            <strong>${runtimeLabel}:</strong>
${runtimeValue}
          </p>

${
  movie.media_type === "tv"
  ? `
  <p>
    <strong>Episodi:</strong>
    ${movieDetails.number_of_episodes || "-"}
  </p>
  `
  : ""
}

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

       console.log(movie.media_type, movie.title, movie.name);

       
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
        movie.id,
      movie.media_type || "movie"
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


     const title =
  movie.title || movie.name;

const year =
  (movie.release_date || movie.first_air_date || "").slice(0,4);

     
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
            <h3>${title}</h3>
            <p>
              ${year}
            </p>
          </div>
        `;

        div.addEventListener(
          "click",
          async () => {

            const movieDetails =
              await fetchMovieDetails(
                movie.id,
                 movie.media_type || "movie"
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
            title;
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



function goToMovie(id, mediaType){

  window.location.href =
    `add-review.html?id=${id}&type=${mediaType}`;

}


function openRating(id){

  window.location.href =
    `add-review.html?id=${id}&type=${mediaType}`;

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
   
currentMovieStatus =
  data?.[0]?.status || null;
   
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


async function saveMovie(status){

  const {
    data:{ user }
  } =
  await supabaseClient.auth.getUser();

  if(!user || !selectedMovieData) return;

  await supabaseClient
    .from("user_movies")
    .upsert({
      user_id:user.id,
      movie_id:selectedMovieData.id,
      title:selectedMovieData.title,
      poster_path:selectedMovieData.poster_path,
      media_type: selectedMovieData.media_type || "movie",
      director:
  selectedMovieData.director ||
  "",
      genre:
        selectedMovieData.genres
          ?.map(g => g.name)
          .join(", ") || "",

      release_year:
  Number(
    (
      selectedMovieData.release_date ||
      selectedMovieData.first_air_date ||
      ""
    ).slice(0,4)
  ) || null,

      status
    });

}

async function removeStatus(status){

  const {
    data:{ user }
  } =
  await supabaseClient.auth.getUser();

  if(!user || !selectedMovieData) return;

  await supabaseClient
    .from("user_movies")
    .delete()
    .eq("user_id", user.id)
    .eq("movie_id", selectedMovieData.id)
    .eq("status", status);

}

async function toggleMovieStatus(status){

  const {
    data:{ user }
  } =
  await supabaseClient.auth.getUser();

  if(!user || !selectedMovieData) return;

  const movieId =
    selectedMovieData.id;

  const { data } =
    await supabaseClient
      .from("user_movies")
      .select("status")
      .eq("user_id", user.id)
      .eq("movie_id", movieId);

  const statuses =
    data?.map(x => x.status) || [];

  const watchlistExists =
    statuses.includes("watchlist");

  const watchedExists =
    statuses.includes("watched");

  const favoriteExists =
    statuses.includes("favorite");

  const desertExists =
    statuses.includes("desert");


  switch(status){

    case "watchlist":

      if(watchlistExists){

        await removeStatus("watchlist");

      }else{

        await removeStatus("watched");
        await removeStatus("favorite");
        await removeStatus("desert");

        await saveMovie("watchlist");

      }

      break;


    case "watched":

      if(watchedExists){

        await removeStatus("desert");
        await removeStatus("favorite");
        await removeStatus("watched");

      }else{

        await removeStatus("watchlist");

        await saveMovie("watched");

      }

      break;


    case "favorite":

      if(favoriteExists){

        await removeStatus("favorite");

      }else{

        if(!watchedExists){

          await saveMovie("watched");

        }

        await removeStatus("watchlist");

        await saveMovie("favorite");

      }

      break;


    case "desert":

      if(desertExists){

        await removeStatus("desert");

      }else{

        await supabaseClient
          .from("user_movies")
          .delete()
          .eq("user_id", user.id)
          .eq("status", "desert");

        if(!watchedExists){

          await saveMovie("watched");

        }

        if(!favoriteExists){

          await saveMovie("favorite");

        }

         
        await removeStatus("watchlist");

        await saveMovie("desert");

      }

      break;

  }
currentMovieStatus = status;
  await loadMovieStatuses();

}


