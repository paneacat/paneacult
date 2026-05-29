

/* =========================
   CLOSE SEARCH RESULTS
========================= */


document.addEventListener(
  "click",
  (e) => {

    if(
      typeof movieSearchInput ===
        "undefined" ||
      typeof movieResults ===
        "undefined"
    ) return;

    const clickedInsideSearch =
      movieSearchInput?.contains(
        e.target
      ) ||
      movieResults?.contains(
        e.target
      );

    if(!clickedInsideSearch){

      movieResults.innerHTML =
        "";

    }

  }
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

  const desertBtn =
    document.getElementById(
      "markDesertBtn"
    );

  watchedBtn?.classList.remove(
    "active"
  );

  watchlistBtn?.classList.remove(
    "active"
  );

  desertBtn?.classList.remove(
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

  if(status === "desert"){

    desertBtn?.classList.add(
      "active"
    );

  }

}


/* =========================
   SAVE MOVIE STATUS
========================= */

function saveMovieStatus(status){

  currentMovieStatus = status;

  localStorage.setItem(
    `paneacult_movie_status_${selectedMovieData.id}`,
    status
  );

  updateMovieButtons(status);

}


/* =========================
   SETUP BUTTONS
========================= */

function setupMovieButtons(){

  const markWatchedBtn =
    document.getElementById(
      "markWatchedBtn"
    );

  const markWatchlistBtn =
    document.getElementById(
      "markWatchlistBtn"
    );
const markDesertBtn =
  document.getElementById(
    "markDesertBtn"
  );

  markWatchedBtn?.addEventListener(
    "click",
    () => {

      saveMovieStatus(
        "watched"
      );

    }
  );

  markWatchlistBtn?.addEventListener(
    "click",
    () => {

      saveMovieStatus(
        "watchlist"
      );

    }
  );

   markDesertBtn?.addEventListener(
  "click",
  () => {

    localStorage.setItem(
      "paneacult_desert_island",
      JSON.stringify(
        selectedMovieData
      )
    );

    toggleMovieList(
      "paneacult_favorites"
    );

    markDesertBtn.classList.add(
      "active"
    );

  }
);
}


/* =========================
   ELEMENTI
========================= */

const enterBtn =
  document.querySelector(
    ".welcome-btn.primary"
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
       CUSTOM CURSOR
    ========================= */

    const cursor =
      document.querySelector(".cursor");

    if(
  cursor &&
  window.innerWidth > 768
){
      document.addEventListener(
        "mousemove",
        (e) => {

          cursor.style.left =
            e.clientX + "px";

          cursor.style.top =
            e.clientY + "px";

        }
      );

    }


 /* =========================
       CREDITS
    ========================= */

    const credits =
      document.querySelector(
        ".credits"
      );

    if(credits){

      const observer =
        new IntersectionObserver(
          entries => {

            entries.forEach(
              entry => {

                if(
                  entry.isIntersecting
                ){

                  credits.classList.add(
                    "show"
                  );

                }

              }
            );

          },
          {
            threshold: 0.2
          }
        );

      observer.observe(credits);

    }

    /* =========================
       FADE-UP
    ========================= */

    const elements =
      document.querySelectorAll(
        ".fade-up"
      );

    if(elements.length){

      setTimeout(() => {

        elements.forEach(el => {

          el.classList.add(
            "show"
          );

        });

      }, 200);

      const observerFade =
        new IntersectionObserver(
          entries => {

            entries.forEach(
              entry => {

                if(
                  entry.isIntersecting
                ){

                  entry.target.classList.add(
                    "show"
                  );

                }

              }
            );

          },
          {
            threshold: 0.2
          }
        );

      elements.forEach(el => {

        observerFade.observe(el);

      });

    }

    /* =========================
       MOBILE MENU
    ========================= */

    const menuToggle =
      document.querySelector(
        ".menu-toggle"
      );

    const menu =
      document.querySelector(
        ".menu"
      );

    menuToggle?.addEventListener(
      "click",
      () => {

        menu.classList.toggle(
          "active"
        );

      }
    );

/* =========================
   FADE IN BODY
========================= */

window.addEventListener(
  "load",
  () => {

    document.body.classList.add(
      "loaded"
    );

  }
);

/* =========================
   ESCAPE LOGIN
========================= */

document.addEventListener(
  "keydown",
  (e) => {

    if(
      e.key === "Escape" &&
      document.body.classList.contains(
        "login-page"
      )
    ){

      window.location.href =
        "index.html";

    }

  }
);


/* =========================
   LOGOUT
========================= */

document
  .querySelectorAll(
    ".logout-btn"
  )
  .forEach(btn => {

    btn.addEventListener(
      "click",
      async (e) => {

        e.preventDefault();

        await supabaseClient.auth
          .signOut();

        window.location.href =
          "login.html";

      }
    );

  });


