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
function setupMovieButtons(){

  const markWatchedBtn =
    document.getElementById(
      "markWatchedBtn"
    );

  const markWatchlistBtn =
    document.getElementById(
      "markWatchlistBtn"
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

}
  currentMovieStatus = status;

  localStorage.setItem(
    `paneacult_movie_status_${selectedMovieData.id}`,
    status
  );

  updateMovieButtons(status);

}

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
       SPLASH
    ========================= */

    const splash =
      document.getElementById(
        "splash"
      );

    if(splash){

      setTimeout(() => {

        splash.style.opacity = "0";

        splash.style.transition =
          ".6s";

        setTimeout(() => {

          splash.remove();

        }, 400);

      }, 400);

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




