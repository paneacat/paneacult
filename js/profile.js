
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

function getMovies(key){

  return JSON.parse(
    localStorage.getItem(key)
  ) || [];

}

let watched = [];

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
        Nessun film qui!
      </p>
    
    `;

    return;

  }

grid.innerHTML =

  movies.map(movie => `

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
        movie.title
          ?.toLowerCase()
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

  if(year === "new"){

    filtered =
      filtered.filter(
        movie => {

          const y =
            parseInt(
              movie.release_date
              ?.slice(0,4)
            );

          return y >= 2020;

        }
      );

  }

  if(year === "modern"){

    filtered =
      filtered.filter(
        movie => {

          const y =
            parseInt(
              movie.release_date
              ?.slice(0,4)
            );

          return (
            y >= 2000 &&
            y < 2020
          );

        }
      );

  }

  if(year === "classic"){

    filtered =
      filtered.filter(
        movie => {

          const y =
            parseInt(
              movie.release_date
              ?.slice(0,4)
            );

          return y < 2000;

        }
      );

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
        movie.title
          ?.toLowerCase()
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

  if(year === "new"){

    filtered =
      filtered.filter(
        movie => {

          const y =
            parseInt(
              movie.release_date
              ?.slice(0,4)
            );

          return y >= 2020;

        }
      );

  }

  if(year === "modern"){

    filtered =
      filtered.filter(
        movie => {

          const y =
            parseInt(
              movie.release_date
              ?.slice(0,4)
            );

          return (
            y >= 2000 &&
            y < 2020
          );

        }
      );

  }

  if(year === "classic"){

    filtered =
      filtered.filter(
        movie => {

          const y =
            parseInt(
              movie.release_date
              ?.slice(0,4)
            );

          return y < 2000;

        }
      );

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
        movie.title
          ?.toLowerCase()
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

  if(year === "new"){

  filtered =
    filtered.filter(
      movie => {

        const y =
          parseInt(
            movie.release_date
            ?.slice(0,4)
          );

        return y >= 2020;

      }
    );

}

if(year === "modern"){

  filtered =
    filtered.filter(
      movie => {

        const y =
          parseInt(
            movie.release_date
            ?.slice(0,4)
          );

        return (
          y >= 2000 &&
          y < 2020
        );

      }
    );

}

if(year === "classic"){

  filtered =
    filtered.filter(
      movie => {

        const y =
          parseInt(
            movie.release_date
            ?.slice(0,4)
          );

        return y < 2000;

      }
    );

}
  /* ORDER */

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

function renderCurrentFavorite(){

  const desertMovie =
    JSON.parse(
      localStorage.getItem(
        "paneacult_desert_island"
      )
    );

  if(
    !desertMovie ||
    !currentFavorite
  ) return;

  currentFavorite.innerHTML = `

  <img
    src="${
      desertMovie.poster_path
        ? `https://image.tmdb.org/t/p/w500${desertMovie.poster_path}`
        : desertMovie.poster
    }"
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
  desertMovie.movie_id ||
  desertMovie.id
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


function renderRecentActivity(){

  if(!activityFeed) return;

  const recent =
    JSON.parse(
      localStorage.getItem(
        "paneacult_recent"
      )
    ) || [];

  if(!recent.length){

    activityFeed.innerHTML = `
      <p class="empty-text">
        Nessuna attività recente.
      </p>
    `;

    return;

  }

  activityFeed.innerHTML =

    recent.map(movie => `

  <div
    class="saved-card"
    onclick="goToMovie(${
  movie.movie_id ||
  movie.id
})">

    <img
  src="${
    movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : movie.movie_poster ||
        movie.poster
  }"
  alt="${
  movie.title ||
  movie.movie_title
}"
>

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

  const favorites =
    getMovies(
      "paneacult_favorites"
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

  if(favoritesCount){

    favoritesCount.textContent =
      favorites.length;

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

if(watchlistGrid){
  renderGrid(
    watchlistGrid,
    watchlist
  );
   populateWatchlistFilters();
filterWatchlist();
}

if(favoriteGrid){

  renderGrid(
    favoriteGrid,
    favorites
  );

  populateFavoriteFilters();
  filterFavorites();

}

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

importBtn?.addEventListener(
  "click",
  () => {

    importInput.click();

  }
);

importInput?.addEventListener(
  "change",
  async e => {

    const file =
      e.target.files?.[0];

    if(!file){

      alert(
        "Nessun file selezionato"
      );

      return;

    }

    const text =
      await file.text();

    const rows =
      text
        .split("\n")
        .slice(1);

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
      const row of rows
    ){

      const cols =
  row.split(",");

const title =
  cols[1]
    ?.replaceAll('"',"")
    ?.trim();

const rating =
  cols[5]
    ?.replaceAll('"',"")
    ?.trim();

const review =
  cols[6]
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

      status:
        "watched"

    });

  /* RATING + REVIEW */

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
          ? parseFloat(rating)
          : null,

      review_text:
        review || null,

      username:
        localStorage.getItem(
          "paneacult_username"
        ) || "cinefilo",

      slug:
        movie.title
          .toLowerCase()
          .replaceAll(" ","-")
          .replace(/[^\w-]+/g,"")

    });

  imported++;

}catch(err){

  console.log(err);

      }
            user_id:
              user.id,

            movie_id:
              movie.id,

            title:
              movie.title,

            poster_path:
              movie.poster_path,

            status:
              "watched"

          });

        imported++;

      }catch(err){

        console.log(err);

      }

    }

    alert(
      `${imported} film importati 🎬`
    );

    location.reload();

  }
);

document
  .getElementById(
    "watchedSearch"
  )
  ?.addEventListener(
    "input",
    filterWatched
  );

document
  .getElementById(
    "watchedFilter"
  )
  ?.addEventListener(
    "change",
    filterWatched
  );
document
  .getElementById(
    "watchlistSearch"
  )
  ?.addEventListener(
    "input",
    filterWatchlist
  );
     
filterWatchlist();
     
document
  .getElementById(
    "watchlistFilter"
  )
  ?.addEventListener(
    "change",
    filterWatchlist
  );

document
  .getElementById(
    "watchlistGenre"
  )
  ?.addEventListener(
    "change",
    filterWatchlist
  );

document
  .getElementById(
    "watchlistYear"
  )
  ?.addEventListener(
    "change",
    filterWatchlist
  );

document
  .getElementById(
    "watchedGenre"
  )
  ?.addEventListener(
    "change",
    filterWatched
  );

document
  .getElementById(
    "watchedYear"
  )
  ?.addEventListener(
    "change",
    filterWatched
  );

         document
  .getElementById(
    "favoriteSearch"
  )
  ?.addEventListener(
    "input",
    filterFavorites
  );

document
  .getElementById(
    "favoriteGenre"
  )
  ?.addEventListener(
    "change",
    filterFavorites
  );

document
  .getElementById(
    "favoriteYear"
  )
  ?.addEventListener(
    "change",
    filterFavorites
  );

document
  .getElementById(
    "favoriteFilter"
  )
  ?.addEventListener(
    "change",
    filterFavorites
  );
