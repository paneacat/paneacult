const supabaseUrl =
  "https://czvtirkuyhcilmzbwysf.supabase.co";

const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6dnRpcmt1eWhjaWxtemJ3eXNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczOTM1NjIsImV4cCI6MjA5Mjk2OTU2Mn0.v--ZBxJyMAIpb1bWbN6J3DUDi5FfcoOrhKccwRyuEvw";

const supabaseClient =
  supabase.createClient(
    supabaseUrl,
    supabaseKey
  );

document.addEventListener("DOMContentLoaded", async () => {
const {
  data: { session }
} = await supabaseClient.auth.getSession();

if(
  session &&
  window.location.pathname.includes("login")
){

  window.location.href =
    "/home.html";

  return;
}

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
    movieDetails.credits.crew.find(
      person => person.job === "Director"
    );

  const cast =
    movieDetails.credits.cast
      .slice(0, 4)
      .map(actor => actor.name)
      .join(", ");

  selectedMovieData = movie;

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


/* =========================
   AUTOSAVE REVIEW
========================= */

const reviewText =
  document.getElementById(
    "reviewText"
  );

const reviewRating =
  document.getElementById(
    "reviewRating"
  );

const autosaveStatus =
  document.getElementById(
    "autosaveStatus"
  );

/* LOAD SAVED */

if(reviewText){

  const savedReview =
    localStorage.getItem(
      "paneacult_review_text"
    );

  if(savedReview){

    reviewText.value =
      savedReview;

  }

}

if(reviewRating){

  const savedRating =
    localStorage.getItem(
      "paneacult_review_rating"
    );

  if(savedRating){

    reviewRating.value =
      savedRating;

  }

}

/* SAVE TEXT */

reviewText?.addEventListener(
  "input",
  () => {

    localStorage.setItem(
      "paneacult_review_text",
      reviewText.value
    );

    if(autosaveStatus){

      autosaveStatus.textContent =
        "Bozza salvata";

      autosaveStatus.style.opacity =
        ".9";

      clearTimeout(
        window.autosaveTimeout
      );

      window.autosaveTimeout =
        setTimeout(() => {

          autosaveStatus.textContent =
            "Bozza salvata automaticamente";

          autosaveStatus.style.opacity =
            ".55";

        }, 1500);

    }

  }
);

/* SAVE RATING */

reviewRating?.addEventListener(
  "change",
  () => {

    localStorage.setItem(
      "paneacult_review_rating",
      reviewRating.value
    );

  }
);

/* =========================
   RESTORE SELECTED MOVIE
========================= */

const savedMovie =
  localStorage.getItem(
    "paneacult_selected_movie"
  );

const savedMovieHTML =
  localStorage.getItem(
    "paneacult_selected_movie_html"
  );

if(
  savedMovie &&
  savedMovieHTML &&
  selectedMovie
){

  selectedMovieData =
    JSON.parse(savedMovie);

  selectedMovie.innerHTML =
    savedMovieHTML;

  reviewForm.style.display =
    "block";

  movieSearchInput.value =
    selectedMovieData.title;

}

/* =========================
   CLOSE SEARCH RESULTS
========================= */

document.addEventListener(
  "click",
  (e) => {

    const clickedInsideSearch =
      movieSearchInput?.contains(e.target) ||
      movieResults?.contains(e.target);

    if(!clickedInsideSearch){

      movieResults.innerHTML = "";

    }

  }
);




const publishReviewBtn =
  document.getElementById(
    "publishReviewBtn"
  );
/* =========================
   BUTTON STATES
========================= */

function updateMovieButtons(status){

  const watchedBtn =
    document.getElementById(
      "markWatchedBtn"
    );

  const watchlistBtn =
    document.getElementById(
      "markWatchlistBtn"
    );

  watchedBtn?.classList.remove(
    "active"
  );

  watchlistBtn?.classList.remove(
    "active"
  );

  if(status === "watched"){

    watchedBtn?.classList.add(
      "active"
    );

  }

  if(status === "watchlist"){

    watchlistBtn?.classList.add(
      "active"
    );

  }

}

function saveMovieStatus(status){

  currentMovieStatus = status;

  localStorage.setItem(
    `paneacult_movie_status_${selectedMovieData.id}`,
    status
  );

  updateMovieButtons(status);

}

const markWatchedBtn =
  document.getElementById(
    "markWatchedBtn"
  );

const markWatchlistBtn =
  document.getElementById(
    "markWatchlistBtn"
  );

publishReviewBtn?.addEventListener(
  "click",
  async () => {

    if(!selectedMovieData){

      alert(
        "Seleziona un film"
      );

      return;

    }

    const review =
      reviewText.value.trim();

    const rating =
      reviewRating.value;

    if(review === ""){

      alert(
        "Scrivi una recensione"
      );

      return;

    }

    const { error } =
      await supabaseClient
        .from("reviews")
        .insert([
          {

            movie_id:
              selectedMovieData.id,

            movie_title:
              selectedMovieData.title,

            movie_poster:
              selectedMovieData.poster_path,

            review_text:
              review,

            rating:
              rating

          }
        ]);

    if(error){

      console.error(error);

      alert(
        "Errore nel salvataggio"
      );

      return;

    }

    alert(
      "Recensione pubblicata 🎬"
    );

    localStorage.removeItem(
      "paneacult_review_text"
    );

    localStorage.removeItem(
      "paneacult_review_rating"
    );

  }
);

/* =========================
   ELEMENTI
========================= */

const enterBtn =
  document.querySelector(
    ".welcome-btn.primary"
  );

const logoutBtn =
  document.querySelector(
    ".logout-btn"
  );

const saveBtns =
  document.querySelectorAll(
    ".save-movie-btn"
  );

const loginBtn =
  document.querySelector(
    ".login-btn"
  );

const registerBtn =
  document.querySelector(
    ".register-btn"
  );

/* =========================
   CHECK SESSIONE
========================= */

async function checkSession(){

  const {
    data: { session }
  } =
  await supabaseClient.auth.getSession();

  /* LOGGATO */

  if(session){

    document.body.classList.add(
      "logged-user"
    );

    if(enterBtn){

      enterBtn.innerText =
        "Vai al tuo archivio";

      enterBtn.href =
        "profilo.html";

    }

  }

  /* NON LOGGATO */

  else {

    document.body.classList.add(
      "guest-user"
    );

    /* BOTTONE WELCOME */

    if(enterBtn){

      enterBtn.innerText =
        "Accedi a paneacult";

      enterBtn.href =
        "login.html";

    }

    /* BOTTONI FILM */

    saveBtns.forEach(btn => {

      btn.addEventListener(
        "click",
        () => {

          window.location.href =
            "login.html";

        }
      );

    });

  }

}

checkSession();

/* =========================
   LOAD PROFILE
========================= */

async function loadProfile(){

  const {
    data: { user }
  } =
  await supabaseClient.auth.getUser();

  const profileEmail =
    document.getElementById(
      "profileEmail"
    );

  if(!profileEmail){

    return;

  }

  if(!user){

    window.location.href =
      "login.html";

    return;

  }

  profileEmail.textContent =
    user.email;

}

loadProfile();
/* =========================
   LOGOUT
========================= */

logoutBtn?.addEventListener(
  "click",
  async () => {

    await supabaseClient.auth.signOut();

    window.location.href =
      "login.html";

  }
);


/* =========================
   SAVE MOVIES
========================= */

saveBtns.forEach(btn => {

  btn.addEventListener(
    "click",
    async () => {

      const {
        data: { user }
      } =
      await supabaseClient.auth.getUser();

      if(!user){

        window.location.href =
          "login.html";

        return;

      }

      const movie =
        btn.dataset.movie;

      const poster =
        btn.dataset.poster;

      const link =
        btn.dataset.link;

      const type =
        btn.dataset.type;

      const icon =
        btn.dataset.icon;

      /* CHECK */

      const { data: existing } =
        await supabaseClient
          .from("saved_movies")
          .select("*")
          .eq("user_id", user.id)
          .eq("movie", movie)
          .eq("type", type);

      /* REMOVE */

      if(existing.length > 0){

        await supabaseClient
          .from("saved_movies")
          .delete()
          .eq("id", existing[0].id);

        btn.classList.remove(
          "saved-state"
        );

        /* RESET TESTO */

        if(icon === "save"){
          btn.innerText =
            "☆ Salva il film";
        }

        if(icon === "favorite"){
          btn.innerText =
            "♡ Lo adoro!";
        }

        if(icon === "watched"){
          btn.innerText =
            "✓ L'ho visto";
        }

        return;

      }

      /* INSERT */

      const { error } =
        await supabaseClient
          .from("saved_movies")
          .insert([{

            user_id: user.id,

            movie,

            poster,

            link,

            type

          }]);

      if(error){

        console.log(error);

        return;

      }

      /* ATTIVO */

      btn.classList.add(
        "saved-state"
      );

      if(icon === "save"){
        btn.innerText =
          "★ Salva il film";
      }

      if(icon === "favorite"){
        btn.innerText =
          "♥ Lo adoro!";
      }

      if(icon === "watched"){
        btn.innerText =
          "✓ Visto";
      }

    }
  );

});

/* =========================
   LOAD SAVED MOVIES
========================= */

async function loadSavedMovies(){

  const savedGrid =
    document.getElementById(
      "savedGrid"
    );

  const watchedGrid =
    document.getElementById(
      "watchedGrid"
    );

  const favoriteGrid =
    document.getElementById(
      "favoriteGrid"
    );

  if(
    !savedGrid ||
    !watchedGrid ||
    !favoriteGrid
  ){

    return;

  }

  const {
    data: { user }
  } =
  await supabaseClient.auth.getUser();

  if(!user){

    return;

  }

  const { data, error } =
    await supabaseClient
      .from("saved_movies")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false
      });

  if(error){

    console.log(error);

    return;

  }

  /* RESET */

  savedGrid.innerHTML = "";

  watchedGrid.innerHTML = "";

  favoriteGrid.innerHTML = "";

  /* EMPTY */

  if(data.length === 0){

    savedGrid.innerHTML = `
      <p class="empty-grid">
        Nessun film salvato.
      </p>
    `;

    watchedGrid.innerHTML = `
      <p class="empty-grid">
        Nessun film visto.
      </p>
    `;

    favoriteGrid.innerHTML = `
      <p class="empty-grid">
        Nessun preferito.
      </p>
    `;

    return;

  }

  /* CARD FILM */

  data.forEach(movie => {

    const card = `

      <a
        href="${movie.link}"
        class="saved-card"
      >

        <img
          src="${movie.poster}"
          alt="${movie.movie}"
        >

        <div class="saved-overlay">

          <h3>
            ${movie.movie}
          </h3>

          <button
            class="remove-btn"
            data-id="${movie.id}"
          >

            Rimuovi

          </button>

        </div>

      </a>

    `;

    /* SAVED */

    if(movie.type === "saved"){

      savedGrid.innerHTML += card;

    }

    /* WATCHED */

    if(movie.type === "watched"){

      watchedGrid.innerHTML += card;

    }

    /* FAVORITE */

    if(movie.type === "favorite"){

      favoriteGrid.innerHTML += card;

    }

  });

}

loadSavedMovies();
  
/* =========================
   CHECK SAVED
========================= */

async function checkIfSaved(){

  if(!saveBtns.length){

    return;

  }

  const {
    data: { user }
  } =
  await supabaseClient.auth.getUser();

  if(!user){

    return;

  }

  saveBtns.forEach(async btn => {

    const movie =
      btn.dataset.movie;

    const type =
      btn.dataset.type;

    const icon =
      btn.dataset.icon;

    const { data } =
      await supabaseClient
        .from("saved_movies")
        .select("*")
        .eq("user_id", user.id)
        .eq("movie", movie)
        .eq("type", type);

    if(data.length > 0){

      /* SAVE */

      if(icon === "save"){

        btn.innerText =
          "★ Salva il film";

      }

      /* FAVORITE */

      if(icon === "favorite"){

        btn.innerText =
          "♥ Lo adoro!";

      }

      /* WATCHED */

      if(icon === "watched"){

        btn.innerText =
          "✓ L'ho visto";

      }

      btn.classList.add(
        "saved-state"
      );

    }

  });

}

checkIfSaved();

/* =========================
   REMOVE MOVIE
========================= */

document.addEventListener(
  "click",
  async (e) => {

    if(
      e.target.classList.contains(
        "remove-btn"
      )
    ){

      e.preventDefault();

      e.stopPropagation();

      const id =
        e.target.dataset.id;

      await supabaseClient
        .from("saved_movies")
        .delete()
        .eq("id", id);

      loadSavedMovies();

    }

  }
);

/* =========================
   LOGIN
========================= */

loginBtn?.addEventListener(
  "click",
  async (e) => {

    e.preventDefault();

    const email =
      document.querySelector(
        'input[type="email"]'
      ).value;

    const password =
      document.querySelector(
        'input[type="password"]'
      ).value;

    const { error } =
      await supabaseClient
        .auth
        .signInWithPassword({

          email,
          password

        });

    if(error){

      alert(error.message);

    }

    else {

      window.location.href =
        "profilo.html";

    }

  }
);

/* =========================
   REGISTER
========================= */

registerBtn?.addEventListener(
  "click",
  async () => {

    const email =
      document.querySelector(
        'input[type="email"]'
      ).value;

    const password =
      document.querySelector(
        'input[type="password"]'
      ).value;

    const { error } =
      await supabaseClient
        .auth
        .signUp({

  email,
  password,

  options: {

    emailRedirectTo:
      "https://paneacat.github.io/paneacult/profilo.html"

  }

});

    if(error){

      alert(error.message);

    }

    else {

      alert(
        "Controlla la tua email ✨"
      );

    }

  }
);
  
  

  
