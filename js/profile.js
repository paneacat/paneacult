
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

const activityFeed =
  document.getElementById(
    "activityFeed"
  );

/* =========================
   LOAD MOVIES
========================= */

let watched = [];

let watchlist = [];

let favorites = [];

async function loadWatchlist(){

  const {
    data:{ user }
  } =
  await supabaseClient.auth
    .getUser();

  if(!user) return;

  const {
    data
  } =
  await supabaseClient
    .from("user_movies")
    .select("*")
    .eq(
      "user_id",
      user.id
    )
    .eq(
      "status",
      "watchlist"
    );

  watchlist =
    data || [];

  populateWatchlistFilters();

  renderGrid(
    watchlistGrid,
    watchlist
  );

  filterWatchlist();

}


async function loadFavorites(){

  const {
    data:{ user }
  } =
  await supabaseClient.auth
    .getUser();

  if(!user) return;

  const {
    data
  } =
  await supabaseClient
    .from("user_movies")
    .select("*")
    .eq(
      "user_id",
      user.id
    )
    .eq(
      "status",
      "favorite"
    );

  favorites =
    data || [];

  populateFavoriteFilters();

  renderGrid(
    favoriteGrid,
    favorites
  );

  filterFavorites();

}

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
        Nessun film qui!
      </p>
    
    `;

    return;

  }

const isMobile =
  window.innerWidth <= 768;

const moviesToShow =

  isMobile

    ? movies.slice(0,4)

    : movies;
   
grid.innerHTML =

moviesToShow.map(movie => `

    <div
      class="saved-card"
    onclick="goToMovie(${
  movie.movie_id ||
  movie.id
})"
    >

      <img
  src="${
    movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : movie.movie_poster ||
        movie.poster ||
        movie.posterUrl ||
        "img/poster-placeholder.webp"
  }"
alt="${
  movie.title ||
  movie.movie_title
}"
>

      <div class="saved-overlay">

        <h3>
  ${
    movie.title ||
    movie.movie_title
  }
</h3>

      </div>

    </div>

  `).join("");
   
if(
  isMobile &&
  movies.length > 4
){

  let title = "";

  if(
    grid.id === "watchlistGrid"
  ){
    title = "Watchlist";
  }

  if(
    grid.id === "watchedGrid"
  ){
    title = "Watched";
  }

  if(
    grid.id === "favoriteGrid"
  ){
    title = "Loved";
  }

  grid.innerHTML += `

    <button
      class="load-more-btn"
    >
      Vedi tutti (${movies.length})
    </button>

  `;

  const btn =
    grid.querySelector(
      ".load-more-btn"
    );

  btn.onclick = () => {

    openMoviesModal(
      title,
      movies
    );

  };

}
}

function filterWatched(){

  const search =
    document
      .getElementById(
        "watchedSearch"
      )
      ?.value
      .toLowerCase() || "";

  const genre =
    document
      .getElementById(
        "watchedGenre"
      )
      ?.value || "all";

  const year =
    document
      .getElementById(
        "watchedYear"
      )
      ?.value || "all";

  const filter =
    document
      .getElementById(
        "watchedFilter"
      )
      ?.value || "all";

  let filtered =
    [...watched];

  /* SEARCH */

  filtered =
    filtered.filter(
      movie =>
        (movie.title || movie.movie_title || "")
  .toLowerCase()
  .includes(search)
    );

  /* GENRE */

  if(genre !== "all"){

  filtered = filtered.filter(
    movie =>
      movie.genre?.includes(genre)
  );

}
  /* YEAR */

  if(year !== "all"){

  filtered = filtered.filter(movie => {

    const y =
      movie.release_year;

    if(year === "new"){
      return y >= 2020;
    }

    if(year === "modern"){
      return y >= 2000 && y < 2020;
    }

    if(year === "classic"){
      return y < 2000;
    }

    return true;

  });
  }

  
  /* ORDER */

  if(filter === "az"){

    filtered.sort(
      (a,b) =>
        a.title.localeCompare(
          b.title
        )
    );

  }

  if(filter === "recent"){

    filtered.reverse();

  }

  if(filter === "random"){

    const movie =
      filtered[
        Math.floor(
          Math.random() *
          filtered.length
        )
      ];

    filtered =
      movie ? [movie] : [];

  }

  renderGrid(
    watchedGrid,
    filtered
  );

}


   function filterFavorites(){

  const search =
    document
      .getElementById(
        "favoriteSearch"
      )
      ?.value
      .toLowerCase() || "";

  const genre =
    document
      .getElementById(
        "favoriteGenre"
      )
      ?.value || "all";

  const year =
    document
      .getElementById(
        "favoriteYear"
      )
      ?.value || "all";

  const filter =
    document
      .getElementById(
        "favoriteFilter"
      )
      ?.value || "all";

  let filtered =
    [...favorites];

  /* SEARCH */

  filtered =
    filtered.filter(
      movie =>
        (movie.title || movie.movie_title || "")
  .toLowerCase()
  .includes(search)
    );

  /* GENRE */

  if(genre !== "all"){

  filtered = filtered.filter(
    movie =>
      movie.genre?.includes(genre)
  );

  }
  /* YEAR */

  if(year !== "all"){

  filtered = filtered.filter(movie => {

    const y =
      movie.release_year;

    if(year === "new"){
      return y >= 2020;
    }

    if(year === "modern"){
      return y >= 2000 && y < 2020;
    }

    if(year === "classic"){
      return y < 2000;
    }

    return true;

  });

  }
  /* ORDER */

  if(filter === "az"){

    filtered.sort(
      (a,b) =>
        a.title.localeCompare(
          b.title
        )
    );

  }

  if(filter === "recent"){

    filtered.reverse();

  }

  if(filter === "random"){

    const movie =
      filtered[
        Math.floor(
          Math.random() *
          filtered.length
        )
      ];

    filtered =
      movie ? [movie] : [];

  }

  renderGrid(
    favoriteGrid,
    filtered
  );  
   }

function filterWatchlist(){

  const search =
    document
      .getElementById(
        "watchlistSearch"
      )
      ?.value
      .toLowerCase() || "";

  const genre =
    document
      .getElementById(
        "watchlistGenre"
      )
      ?.value || "all";

  const year =
    document
      .getElementById(
        "watchlistYear"
      )
      ?.value || "all";

  const filter =
    document
      .getElementById(
        "watchlistFilter"
      )
      ?.value || "all";

  let filtered =
    [...watchlist];

  /* SEARCH */

  filtered =
    filtered.filter(
      movie =>
        (movie.title || movie.movie_title || "")
  .toLowerCase()
  .includes(search)
    );

  /* GENRE */

  if(genre !== "all"){

    filtered =
      filtered.filter(
        movie =>
          (movie.genres || [])
  .some(g => g.name === genre)
      );

  }

  /* YEAR */

  if(year !== "all"){

  filtered = filtered.filter(movie => {

    const y =
      movie.release_year;

    if(year === "new"){
      return y >= 2020;
    }

    if(year === "modern"){
      return y >= 2000 && y < 2020;
    }

    if(year === "classic"){
      return y < 2000;
    }

    return true;

  });

  }
  /* ORDER */

  if(filter === "recent"){

    filtered.reverse();

  }

 if(filter === "az"){

  filtered.sort(
    (a,b) =>
      a.title.localeCompare(
        b.title
      )
  );

 }if  

  (filter === "random"){

    const movie =
      filtered[
        Math.floor(
          Math.random() *
          filtered.length
        )
      ];

    filtered =
      movie ? [movie] : [];

  }

  renderGrid(
    watchlistGrid,
    filtered
  );

}

function populateFavoriteFilters(){

  const genreSelect =
    document.getElementById(
      "favoriteGenre"
    );

  if(!genreSelect) return;

  const genres =
    [...new Set(

      favorites.flatMap(
        movie =>
          (movie.genres || [])
            .map(g => g.name)
      )

    )].sort();

  genreSelect.innerHTML = `
    <option value="all">
      Tutti i generi
    </option>
  `;

  genres.forEach(
    genre => {

      genreSelect.innerHTML += `
        <option value="${genre}">
          ${genre}
        </option>
      `;

    }
  );

}

function populateWatchedFilters(){

  const genreSelect =
    document.getElementById(
      "watchedGenre"
    );

  if(!genreSelect) return;

  const genres =
    [...new Set(

      watched.flatMap(
        movie =>
          (movie.genres || [])
            .map(g => g.name)
      )

    )].sort();

  genreSelect.innerHTML = `
    <option value="all">
      Tutti i generi
    </option>
  `;

  genres.forEach(
    genre => {

      genreSelect.innerHTML += `
        <option value="${genre}">
          ${genre}
        </option>
      `;

    }
  );

}

function populateWatchlistFilters(){

  const genreSelect =
    document.getElementById(
      "watchlistGenre"
    );

  if(!genreSelect) return;

  const genres =
    [...new Set(

      watchlist.flatMap(
        movie =>
          (movie.genres || [])
            .map(g => g.name)
      )

    )].sort();

  genreSelect.innerHTML = `
    <option value="all">
      Tutti i generi
    </option>
  `;

  genres.forEach(
    genre => {

      genreSelect.innerHTML += `
        <option value="${genre}">
          ${genre}
        </option>
      `;

    }
  );

}

/* =========================
   CURRENT FAVORITE
========================= */
async function renderCurrentFavorite(){

  if(!currentFavorite) return;

  const {
    data:{ user }
  } =
  await supabaseClient.auth
    .getUser();

  if(!user) return;

  const {
    data: desertMovie
  } =
  await supabaseClient
    .from("user_movies")
    .select("*")
    .eq(
      "user_id",
      user.id
    )
    .eq(
      "status",
      "desert"
    )
    .maybeSingle();

  if(!desertMovie){

    currentFavorite.innerHTML = `
      <p class="empty-text">
        Nessun Desert Island Film.
      </p>
    `;

    return;
  }

  currentFavorite.innerHTML = `

    <img
      src="https://image.tmdb.org/t/p/w500${desertMovie.poster_path}"
      alt="${desertMovie.title}"
    >

    <div class="current-favorite-content">

      <p class="current-label">
        DESERT ISLAND FILM
      </p>

      <h3>
        ${desertMovie.title}
      </h3>

      <span>
        non il migliore.
        quello che porteresti con te su un'isola deserta.
      </span>

    </div>

  `;

  currentFavorite.onclick = () => {

    goToMovie(
      desertMovie.movie_id
    );

  };

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

   <div
  class="signature-film"
  onclick="goToMovie(${
    movie.movie_id ||
    movie.id
  })"
>
        <img
  src="${
    movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : movie.poster
  }"
  alt="${
  movie.title ||
  movie.movie_title
}"
>

        <div class="signature-film-overlay">

          <h3>
            ${
  movie.title ||
  movie.movie_title
            }
          </h3>

        </div>

      </div>

    `).join("");

}



async function renderRecentActivity(){

  if(!activityFeed) return;

  const {
    data:{ user }
  } =
  await supabaseClient.auth
    .getUser();

  if(!user) return;

  const {
    data: reviews
  } =
  await supabaseClient
    .from("user_reviews")
    .select("*")
    .eq(
      "user_id",
      user.id
    )
    .order(
      "created_at",
      {
        ascending:false
      }
    );
  
  if(!reviews?.length){

    activityFeed.innerHTML = `
      <p class="empty-text">
        Nessun film votato.
      </p>
    `;

    return;

  }

  activityFeed.innerHTML =

    reviews.map(review => `

      <div
        class="saved-card"
        onclick="goToMovie(${review.movie_id})"
      >

        <img
          src="https://image.tmdb.org/t/p/w500${review.movie_poster}"
          alt="${review.movie_title}"
        >

        <div class="saved-overlay">

          <h3>
            ${review.movie_title}
          </h3>

          <span>
            ${review.rating || "-"} ★
          </span>

        </div>

      </div>

    `).join("");

}




/* =========================
   PROFILE COUNTERS
========================= */

async function updateCounters(){

  const filmsCount =
    document.getElementById(
      "filmsCount"
    );

  const reviewsCount =
    document.getElementById(
      "reviewsCount"
    );
   
const ratedCount =
  document.getElementById(
    "ratedCount"
  );
   
  const favoritesCount =
    document.getElementById(
      "favoritesCount"
    );

   const {
  data:{ user }
} =
await supabaseClient.auth
  .getUser();

if(!user) return;

const {
  data: watchedCloud
} =
await supabaseClient
  .from("user_movies")
  .select("*")
  .eq(
    "user_id",
    user.id
  )
  .eq(
    "status",
    "watched"
  );
   
  if(filmsCount){

    filmsCount.textContent =
  watchedCloud?.length || 0;
  }

  if(
  user &&
  favoritesCount
){

  const {
    count
  } =
  await supabaseClient
    .from("user_movies")
    .select(
      "*",
      {
        count:"exact",
        head:true
      }
    )
    .eq(
      "user_id",
      user.id
    )
    .eq(
      "status",
      "favorite"
    );

  favoritesCount.textContent =
    count || 0;

  }

   if(
  user &&
  reviewsCount
){

  const {
    count
  } =
  await supabaseClient
    .from(
      "user_reviews"
    )
    .select(
      "*",
      {
        count:"exact",
        head:true
      }
    )
    .eq(
      "user_id",
      user.id
    )
    .not(
      "review_text",
      "is",
      null
    );

  reviewsCount.textContent =
    count || 0;
  }
if(
  user &&
  ratedCount
){

  const {
    count
  } =
  await supabaseClient
    .from(
      "user_reviews"
    )
    .select(
      "*",
      {
        count:"exact",
        head:true
      }
    )
    .eq(
      "user_id",
      user.id
    )
    .not(
      "rating",
      "is",
      null
    );

  ratedCount.textContent =
    count || 0;

         }
}

/* =========================
   INIT
========================= */

async function loadWatched(){

  const {
    data:{ user }
  } =
  await supabaseClient.auth
    .getUser();

  if(!user) return;

  const {
    data
  } =
  await supabaseClient
    .from("user_movies")
    .select("*")
    .eq(
      "user_id",
      user.id
    )
    .eq(
      "status",
      "watched"
    );

  watched =
    data || [];

   populateWatchedFilters();
   
  renderGrid(
    watchedGrid,
    watched
  );
filterWatched();
}
loadWatched();

loadWatchlist();

loadFavorites();

renderCurrentFavorite();

renderSignature();

renderRecentActivity();

updateCounters();
/* =========================
   CUSTOM PROFILE
========================= */

const avatarInput =
  document.getElementById(
    "avatarInput"
  );

const usernameInput =
  document.getElementById(
    "usernameInput"
  );

const bioInput =
  document.getElementById(
    "bioInput"
  );

const saveProfileBtn =
  document.getElementById(
    "saveProfileBtn"
  );

const profileAvatarImg =
  document.getElementById(
    "profileAvatarImg"
  );

const profileUsername =
  document.getElementById(
    "profileUsername"
  );

const profileBio =
  document.getElementById(
    "profileBio"
  );

const profileEdit =
  document.querySelector(
    ".profile-edit"
  );
/* LOAD */

const savedAvatar =
  localStorage.getItem(
    "paneacult_avatar"
  );

const savedUsername =
  localStorage.getItem(
    "paneacult_username"
  );

const savedBio =
  localStorage.getItem(
    "paneacult_bio"
  );

if(
  savedAvatar &&
  profileAvatarImg
){

  profileAvatarImg.src =
    savedAvatar;

}

if(
  savedUsername &&
  profileUsername
){

  profileUsername.textContent =
    savedUsername;

  if(usernameInput){

    usernameInput.value =
      savedUsername;

  }

}

if(
  savedBio &&
  profileBio
){

  profileBio.textContent =
    savedBio;

  if(bioInput){

    bioInput.value =
      savedBio;

  }

}

/* SAVE */

saveProfileBtn?.addEventListener(
  "click",
  () => {

    const newUsername =
      usernameInput?.value.trim();

    const newBio =
      bioInput?.value.trim();

    if(
      newUsername &&
      profileUsername
    ){

      profileUsername.textContent =
        newUsername;

      localStorage.setItem(
        "paneacult_username",
        newUsername
      );

    }

    if(
      newBio &&
      profileBio
    ){

      profileBio.textContent =
        newBio;

      localStorage.setItem(
        "paneacult_bio",
        newBio
      );

    }

    if(
      avatarInput?.files?.[0]
    ){

      const reader =
        new FileReader();

      reader.onload =
        e => {

          profileAvatarImg.src =
            e.target.result;

          localStorage.setItem(
            "paneacult_avatar",
            e.target.result
          );

        };

      reader.readAsDataURL(
        avatarInput.files[0]
      );

    }
profileEdit.classList.remove(
  "open"
);
  }
);

const editBtn =
  document.getElementById(
    "editProfileBtn"
  );

editBtn?.addEventListener(
  "click",
  () => {

    profileEdit.classList.toggle(
      "open"
    );

  }
);

function openMoviesModal(
  title,
  movies
){

  const modal =
    document.getElementById(
      "moviesModal"
    );

  modal.innerHTML = `

    <button
      class="modal-close"
    >
      ← Chiudi
    </button>

    <h2>
      ${title}
    </h2>

    <div class="modal-grid">

      ${movies.map(movie => `

        <div
          class="saved-card"
          onclick="goToMovie(${
            movie.movie_id ||
            movie.id
          })"
        >

          <img
            src="${
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : movie.movie_poster ||
                  movie.poster ||
                  movie.posterUrl ||
                  'img/poster-placeholder.webp'
            }"
          >

          <div
            class="saved-overlay"
          >

            <h3>
              ${
                movie.title ||
                movie.movie_title
              }
            </h3>

          </div>

        </div>

      `).join("")}

    </div>

  `;

  modal.classList.add(
    "open"
  );

  modal
    .querySelector(
      ".modal-close"
    )
    .onclick = () => {

      modal.classList.remove(
        "open"
      );

    };

}

function goToMovie(id){

  if(!id){

    console.log(
      "movie id mancante"
    );

    return;

  }

  window.location.href =
    `add-review.html?id=${id}`;

}


/* =========================
   LETTERBOXD IMPORT
========================= */

const importBtn =
  document.getElementById(
    "importLetterboxdBtn"
  );

const importInput =
  document.getElementById(
    "letterboxdImport"
  );

if(importInput){
  importInput.multiple = true;
}

importBtn?.addEventListener(
  "click",
  () => {

    importInput.click();

  }
);

importInput?.addEventListener(
  "change",
  async e => {

    const files =
      [...e.target.files];

    if(!files.length){

      alert(
        "Nessun file selezionato"
      );

      return;

    }

    const {
      data:{ user }
    } =
    await supabaseClient.auth
      .getUser();

    if(!user){

      alert(
        "Login richiesto"
      );

      return;

    }

    let imported = 0;

    for(
      const file of files
    ){

      const text =
        await file.text();

      const rows =
        text
          .split("\n")
          .slice(1);

      const filename =
        file.name.toLowerCase();

      for(
        const row of rows
      ){

        const cols =
          row.split(",");

        const title =
          cols[1]
            ?.replaceAll('"',"")
            ?.trim();

        if(!title)
          continue;

        try{

          const results =
            await searchMovies(
              title
            );

          const movie =
            results?.[0];

          if(!movie)
            continue;

          /* WATCHED */

          if(
            filename.includes(
              "watched"
            )
          ){

            await supabaseClient
              .from("user_movies")
              .upsert({

                user_id:
                  user.id,

                movie_id:
                  movie.id,

                title:
                  movie.title,

                poster_path:
                  movie.poster_path,

               genre:
  selectedMovieData.genres?.[0]?.name || "",

release_year:
  Number(
    selectedMovieData.release_date?.slice(0,4)
  ) || null,

                 
                status:
                  "watched"

              });

          }

          /* WATCHLIST */

          if(
            filename.includes(
              "watchlist"
            )
          ){

            await supabaseClient
              .from("user_movies")
              .upsert({

                user_id:
                  user.id,

                movie_id:
                  movie.id,

                title:
                  movie.title,

                poster_path:
                  movie.poster_path,

                 genre:
  selectedMovieData.genres?.[0]?.name || "",

release_year:
  Number(
    selectedMovieData.release_date?.slice(0,4)
  ) || null,
                 
                status:
                  "watchlist"

              });

          }

          /* RATINGS */

          if(
            filename.includes(
              "ratings"
            )
          ){

            const rating =
              cols[4]
                ?.replaceAll(
                  '"',
                  ""
                )
                ?.trim();

            await supabaseClient
              .from("user_reviews")
              .upsert({

                user_id:
                  user.id,

                movie_id:
                  movie.id,

                movie_title:
                  movie.title,

                movie_poster:
                  movie.poster_path,

                rating:
                  rating
                    ? parseFloat(
                        rating
                      )
                    : null,

                username:
  localStorage.getItem(
    "paneacult_username"
  ) ||
  profileUsername?.textContent ||
  "utente"

              });

          }

          /* REVIEWS */

          if(
            filename.includes(
              "reviews"
            )
          ){
console.log(cols);
            const rating =
  cols[2]
    ?.replaceAll('"',"")
    ?.trim();

            const review =
              cols[4]
                ?.replaceAll('"',"")
    ?.trim();


            await supabaseClient
              .from("user_reviews")
                .upsert({

  user_id: user.id,

  username:
  localStorage.getItem(
    "paneacult_username"
  ) ||
  profileUsername?.textContent ||
  "utente",
                   
  movie_id: movie.id,

  movie_title: movie.title,

  movie_poster: movie.poster_path,

  rating:
    rating
      ? parseFloat(rating)
      : null,

  review_text:
    review || null

});
          }

          imported++;

        }catch(err){

          console.log(
            err
          );

        }

      }

    }

    alert(
      `${imported} import completati 🎬`
    );

    location.reload();

  }
);

/* =========================
   EVENTI FILTRI
========================= */

document
  .getElementById("watchlistSearch")
  ?.addEventListener(
    "input",
    filterWatchlist
  );

document
  .getElementById("watchlistGenre")
  ?.addEventListener(
    "change",
    filterWatchlist
  );

document
  .getElementById("watchlistYear")
  ?.addEventListener(
    "change",
    filterWatchlist
  );

document
  .getElementById("watchlistFilter")
  ?.addEventListener(
    "change",
    filterWatchlist
  );


document
  .getElementById("watchedSearch")
  ?.addEventListener(
    "input",
    filterWatched
  );

document
  .getElementById("watchedGenre")
  ?.addEventListener(
    "change",
    filterWatched
  );

document
  .getElementById("watchedYear")
  ?.addEventListener(
    "change",
    filterWatched
  );

document
  .getElementById("watchedFilter")
  ?.addEventListener(
    "change",
    filterWatched
  );


document
  .getElementById("favoriteSearch")
  ?.addEventListener(
    "input",
    filterFavorites
  );

document
  .getElementById("favoriteGenre")
  ?.addEventListener(
    "change",
    filterFavorites
  );

document
  .getElementById("favoriteYear")
  ?.addEventListener(
    "change",
    filterFavorites
  );

document
  .getElementById("favoriteFilter")
  ?.addEventListener(
    "change",
    filterFavorites
  );
