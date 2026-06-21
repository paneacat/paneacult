

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




function renderStars(rating){

  rating = Number(rating);

  const fullStars =
    Math.floor(rating);

  const halfStar =
    rating % 1 >= 0.5;

  let stars = "";

  for(let i = 0; i < fullStars; i++){

    stars += "★";

  }

  if(halfStar){

    stars += "½";

  }

  return stars;

}
