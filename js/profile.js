
/* =========================
   INIT
========================= */

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
        Nessun film qui!
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

  const desertMovie =
    JSON.parse(
      localStorage.getItem(
        "paneacult_desert_island"
      )
    );
console.log(desertMovie);
alert(JSON.stringify(desertMovie));
  if(
    !desertMovie ||
    !currentFavorite
  ) return;

  currentFavorite.innerHTML = `

    <img
      src="
      https://image.tmdb.org/t/p/w500${desertMovie.poster_path}
      "
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
        quello che porteresti con te.
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

    if(
      profileEdit.style.display ===
      "flex"
    ){

      profileEdit.style.display =
        "none";

    }else{

      profileEdit.style.display =
        "flex";

    }

  }
);
