

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

    if(
  !clickedInsideSearch &&
  movieResults
){

  movieResults.innerHTML =
    "";
  movieResults.style.display =
    "none";

    }

  }
);


/* =========================
   SETUP BUTTONS
========================= */
async function toggleMovieStatus(
  status,
  button
){

  const {
    data:{ user }
  } =
  await supabaseClient.auth
    .getUser();

  if(!user || !selectedMovieData)
    return;

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
      status
    )
    .maybeSingle();

  if(existing){

    await supabaseClient
      .from("user_movies")
      .delete()
      .eq(
        "id",
        existing.id
      );

    button?.classList.remove(
      "active"
    );

    return;

  }

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
        status

    });

  button?.classList.add(
    "active"
  );

}

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
    toggleMovieStatus(
      "watched",
      markWatchedBtn
    );
  }
);
   
  markWatchlistBtn?.addEventListener(
  "click",
  () => {
    toggleMovieStatus(
      "watchlist",
      markWatchlistBtn
    );
  }
);

markDesertBtn?.addEventListener(
  "click",
  () => {
    toggleMovieStatus(
      "desert",
      markDesertBtn
    );
  }
);
   
async function loadMovieStatuses(){

  const {
    data:{ user }
  } =
  await supabaseClient.auth
    .getUser();

  if(!user || !selectedMovieData)
    return;

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
      data.some(
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
      data.some(
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
      data.some(
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
      data.some(
        x =>
          x.status ===
          "desert"
      )
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


