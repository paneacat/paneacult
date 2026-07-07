/*==========================
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

           const details =
await fetchMovieDetails(
  movie.id,
movie.media_type || "movie"
);

const director =
details?.credits?.crew?.find(
  person =>
    person.job === "Director"
)?.name || null;
           

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
  movie.title || movie.name,

                poster_path:
                  movie.poster_path,
media_type:
  movie.media_type || "movie",
                 
               genre: null,

release_year:
  (movie.release_date || movie.first_air_date)
    ? Number(
        (movie.release_date || movie.first_air_date).slice(0,4)
      )
    : null,
                 director:
director,
                  
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
  movie.title || movie.name,

                poster_path:
                  movie.poster_path,
media_type:
  movie.media_type || "movie",
                 
                 genre: null,

release_year:
  (movie.release_date || movie.first_air_date)
    ? Number(
        (movie.release_date || movie.first_air_date).slice(0,4)
      )
    : null,

                 director:
                    director,
                 
                 
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

                title:
  movie.title || movie.name,

                 
                movie_poster:
                  movie.poster_path,
media_type:
  movie.media_type || "movie",
                 
            release_year:
  (movie.release_date || movie.first_air_date)
    ? Number(
        (movie.release_date || movie.first_air_date).slice(0,4)
      )
    : null,
                 
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

  title:
  movie.title || movie.name,

  movie_poster: movie.poster_path,
 media_type:
  movie.media_type || "movie",
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

const tvTimeBtn =
  document.getElementById(
    "importTvTimeBtn"
  );

const tvTimeInput =
  document.getElementById(
    "tvtimeImport"
  );

tvTimeBtn?.addEventListener(
  "click",
  () => {

    tvTimeInput.click();

  }
);

tvTimeInput?.addEventListener(
  "change",
  async (e) => {

    const file = e.target.files[0];

    if(!file) return;

    const zip =
      await JSZip.loadAsync(file);

    const files = Object.keys(zip.files);

     const moviesFile = files.find(file =>
  file.includes("movies") &&
  file.endsWith(".json")
);

console.log(moviesFile);

     const moviesText =
  await zip
    .file(moviesFile)
    .async("string");

const movies =
  JSON.parse(moviesText);

console.log("Film trovati:", movies.length);
     console.log(movies.slice(0,5));
  }
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
  ${movie.title || movie.movie_title}
</h3>

<span class="movie-director">
  ${movie.director ? "di " + movie.director : ""}
</span>

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

      (
        (movie.title || movie.movie_title || "") +
        " " +
        (movie.director || "")
      )
      .toLowerCase()
      .includes(search)

  );

  
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
    (a.title || a.movie_title)
      .localeCompare(
        b.title || b.movie_title
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

      (
        (movie.title || movie.movie_title || "") +
        " " +
        (movie.director || "")
      )
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

      (
        (movie.title || movie.movie_title || "") +
        " " +
        (movie.director || "")
      )
      .toLowerCase()
      .includes(search)

  );

  /* GENRE */

  if(genre !== "all"){

    filtered =
  filtered.filter(
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

  if(filter === "recent"){

    filtered.reverse();

  }

 if(filter === "az"){

  filtered.sort(
  (a,b) =>
    (a.title || a.movie_title)
      .localeCompare(
        b.title || b.movie_title
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

  const genres = [...new Set(
  favorites.flatMap(
    movie =>
      movie.genre
        ? movie.genre.split(", ")
        : []
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
      movie.genre
        ? movie.genre.split(", ")
        : []
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
      movie.genre
        ? movie.genre.split(", ")
        : []
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
  ${movie.title || movie.movie_title}
</h3>

<span class="movie-director">
  ${movie.director ? "di " + movie.director : ""}
</span>

        </div>

      </div>

    `).join("");

}

async function renderRecentActivity(){

  if(!activityFeed) return;

  const { data:{ user } } =
    await supabaseClient.auth.getUser();

  if(!user) return;

  const { data: reviews } =
    await supabaseClient
      .from("user_reviews")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at",{ascending:false});

  if(!reviews || reviews.length===0){

    activityFeed.innerHTML=`
      <p class="empty-text">
        Nessuna recensione.
      </p>
    `;

    const overlay=document.getElementById("allReviews");
    if(overlay) overlay.innerHTML="";

    return;
  }

  function card(review){

    return `

<div class="review-card">

<img
class="review-poster"
src="https://image.tmdb.org/t/p/w200${review.movie_poster}"
>

<div class="review-content">

<h3 class="review-title">
${review.movie_title}
<span class="review-year">
${review.release_year || ""}
</span>
</h3>

<div class="review-stars">
${renderStars(review.rating)}
</div>

<p class="review-text">
${review.review_text || ""}
</p>

<div class="review-date">
${new Date(review.created_at).toLocaleDateString("it-IT")}
</div>

</div>

<div class="review-actions">

<button
class="review-btn edit-review-btn"
data-id="${review.id}">
<i class="fa-solid fa-pen"></i>
</button>

<button
class="review-btn delete-review-btn"
data-id="${review.id}">
<i class="fa-solid fa-trash"></i>
</button>

</div>

</div>

`;

  }

  activityFeed.innerHTML =
    reviews
      .slice(0,3)
      .map(card)
      .join("");

  const allReviews =
    document.getElementById("allReviews");

  if(allReviews){

    allReviews.innerHTML =
      reviews
        .map(card)
        .join("");

  }

  document
    .querySelectorAll(".edit-review-btn")
    .forEach(btn=>{

      btn.onclick=()=>{

        window.location.href=
`add-review.html?edit=${btn.dataset.id}`;

      };

    });

  document
    .querySelectorAll(".delete-review-btn")
    .forEach(btn=>{

      btn.onclick=async()=>{

        if(!confirm("Eliminare la recensione?"))
          return;

        await supabaseClient
          .from("user_reviews")
          .delete()
          .eq("id",btn.dataset.id);

        await renderRecentActivity();
        updateCounters();

      };

    });

}




/* =========================
   PROFILE COUNTERS
========================= */

function getCinephileLevel(count){

  if(count >= 1000){
    return {
      level: "🎥 Mito del Cinema",
      rank: 4
    };
  }

  if(count >= 500){
    return {
      level: "🎞️ Collezionista",
      rank: 3
    };
  }

  if(count >= 300){
    return {
      level: "🎬 Cinefilo",
      rank: 2
    };
  }

  return {
    level: "🍿 Spettatore",
    rank: 1
  };

}

async function updateCounters(){


   const tvCount =
  document.getElementById(
     "tvCount"
  
);

   
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

   const tvFavoritesCount =
  document.getElementById(
    "tvFavoritesCount"
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

   
   const watchedMovies =
  watchedCloud?.filter(
    item => item.media_type === "movie"
  ) || [];

const watchedTv =
  watchedCloud?.filter(
    item => item.media_type === "tv"
  ) || [];

   
  if(filmsCount){

  filmsCount.textContent =
  watchedMovies.length;

     if(tvCount){
  tvCount.textContent =
    watchedTv.length;
     }
}

const cinephileLevel =
  document.getElementById(
    "cinephileLevel"
  );

if(cinephileLevel){

  const watched =
  watchedMovies.length;

  const currentLevel =
    getCinephileLevel(watched);

   const {
  data: profile
} = await supabaseClient
  .from("profiles")
  .select("cinephile_rank")
  .eq("id", user.id)
  .single();

const previousRank =
  profile?.cinephile_rank || 1;

   cinephileLevel.textContent =
  `${currentLevel.level} • ${watched} film visti`;
   
if(currentLevel.rank > previousRank){

  alert(
    `🎉 Congratulazioni!\n\nHai raggiunto il livello\n${currentLevel.level}!`
  );

  await supabaseClient
    .from("profiles")
    .update({
      cinephile_rank: currentLevel.rank
    })
    .eq("id", user.id);
}
}
   
  if (
  user &&
  tvFavoritesCount
) {

  const { count } =
    await supabaseClient
      .from("user_movies")
      .select("*", {
        count: "exact",
        head: true
      })
      .eq("user_id", user.id)
      .eq("status", "favorite")
      .eq("media_type", "tv");

  tvFavoritesCount.textContent =
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

(async () => {

  const {
    data: { user }
  } = await supabaseClient.auth.getUser();

  if (!user) return;

  const { data: profile, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) return;

  if (profile.username && profileUsername) {
    profileUsername.textContent = profile.username;

    if (usernameInput) {
      usernameInput.value = profile.username;
    }
  }

  if (profile.bio && profileBio) {
    profileBio.textContent = profile.bio;

    if (bioInput) {
      bioInput.value = profile.bio;
    }
  }

  if (profile.avatar_url && profileAvatarImg) {
    profileAvatarImg.src = profile.avatar_url;
  }

})();

/* SAVE */

saveProfileBtn?.addEventListener("click", async () => {
   
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


       const {
  data: { user }
} = await supabaseClient.auth.getUser();

if (!user) {
  console.log("Utente non trovato");
  return;
}

const { data, error } = await supabaseClient
  .from("profiles")
  .upsert({
    id: user.id,
    username: newUsername,
    bio: newBio
  })
  .select();

console.log("USER:", user);
console.log("DATA:", data);
console.log("ERROR:", error);
       
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
  ${movie.title || movie.movie_title}
</h3>

<span class="movie-director">
  ${movie.director ? "di " + movie.director : ""}
</span>
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
