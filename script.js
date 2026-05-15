document.addEventListener(
  "DOMContentLoaded",
  () => {

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
       FILTRI ARCHIVIO
    ========================= */

    const cards =
      document.querySelectorAll(
        ".archivio-card"
      );

    const categoryFilter =
      document.getElementById(
        "categoryFilter"
      );

    const genreFilter =
      document.getElementById(
        "genreFilter"
      );

    const emptyState =
      document.getElementById(
        "emptyState"
      );

    const loadMoreBtn =
      document.getElementById(
        "loadMoreBtn"
      );

    const resetBtn =
      document.getElementById(
        "resetFilters"
      );

    let visibleCards = 3;

    function aggiornaFiltri(){

      const category =
        categoryFilter
          ? categoryFilter.value
          : "all";

      const genre =
        genreFilter
          ? genreFilter.value
          : "all";

      let totalVisible = 0;

      cards.forEach(card => {

        const categories =
          card.dataset.category
            ? card.dataset.category.split(" ")
            : [];

        const matchCategory =
          category === "all" ||
          categories.includes(category);

        const matchGenre =
          genre === "all" ||
          categories.includes(genre);

        const visible =
          matchCategory &&
          matchGenre;

        if(visible){

          totalVisible++;

          if(totalVisible <= visibleCards){

            card.style.display =
              "block";

          }

          else {

            card.style.display =
              "none";

          }

        }

        else {

          card.style.display =
            "none";

        }

      });

      if(emptyState){

        emptyState.classList.toggle(
          "show",
          totalVisible === 0
        );

      }

      if(loadMoreBtn){

        loadMoreBtn.style.display =
          totalVisible <= visibleCards
            ? "none"
            : "flex";

      }

    }

    categoryFilter?.addEventListener(
      "change",
      () => {

        visibleCards = 3;

        aggiornaFiltri();

      }
    );

    genreFilter?.addEventListener(
      "change",
      () => {

        visibleCards = 3;

        aggiornaFiltri();

      }
    );

    resetBtn?.addEventListener(
      "click",
      () => {

        if(categoryFilter){
          categoryFilter.value = "all";
        }

        if(genreFilter){
          genreFilter.value = "all";
        }

        visibleCards = 3;

        aggiornaFiltri();

      }
    );

    loadMoreBtn?.addEventListener(
      "click",
      () => {

        visibleCards += 3;

        aggiornaFiltri();

      }
    );

    aggiornaFiltri();

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
       SLIDER
    ========================= */

    const slider =
      document.getElementById(
        "slider"
      );

    const next =
      document.getElementById(
        "next"
      );

    const prev =
      document.getElementById(
        "prev"
      );

    if(slider && next && prev){

      function updateArrows(){

        const maxScroll =
          slider.scrollWidth -
          slider.clientWidth;

        if(
          slider.scrollLeft >=
          maxScroll - 10
        ){

          prev.style.opacity = "1";

          prev.style.pointerEvents =
            "auto";

        }

        else {

          prev.style.opacity = "0";

          prev.style.pointerEvents =
            "none";

        }

      }

      next.addEventListener(
        "click",
        () => {

          slider.scrollBy({

            left:
              slider.clientWidth,

            behavior:
              "smooth"

          });

        }
      );

      prev.addEventListener(
        "click",
        () => {

          slider.scrollTo({

            left: 0,

            behavior:
              "smooth"

          });

        }
      );

      slider.addEventListener(
        "scroll",
        updateArrows
      );

      updateArrows();

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

/* =========================
   SEARCH + FILTRI
========================= */

const searchInput =
  document.getElementById(
    "searchInput"
  );

if(searchInput){

  const archivioCards =
    document.querySelectorAll(
      ".archivio-card"
    );

  const genreFilter =
  document.getElementById(
    "genreFilter"
  );

const rubricaFilter =
  document.getElementById(
    "rubricaFilter"
  );
      

  const ratingFilter =
    document.getElementById(
      "ratingFilter"
    );

  let timeout;

  function filterCards(){
const rubrica =
  rubricaFilter
    ? rubricaFilter.value
        .toLowerCase()
    : "";
    
    const search =
      searchInput.value.toLowerCase();

    const genre =
      genreFilter
        ? genreFilter.value.toLowerCase()
        : "";

    const rating =
      ratingFilter
        ? ratingFilter.value
        : "";

    archivioCards.forEach(card => {

      const text =
        card.textContent.toLowerCase();

      const cardGenre =
        card.dataset.genre || "";

      const cardRating =
        card.dataset.rating || "";
      
const cardRubrica =
  card.dataset.rubrica || "";
      
      const matchesSearch =
        text.includes(search);

      const matchesRubrica =

  !rubrica ||

  cardRubrica === rubrica;
      
      const matchesGenre =

  !genre ||

  cardGenre
    .split(" ")
    .includes(genre);

      const matchesRating =
        !rating ||
        cardRating === rating;

      if(
        matchesSearch &&
matchesGenre &&
matchesRating &&
matchesRubrica
      ){

        card.style.display =
          "block";

        card.style.opacity = "1";

      }

      else {

        card.style.display =
          "none";

      }

    });

  }

  searchInput.addEventListener(
    "input",
    () => {

      clearTimeout(timeout);

      timeout = setTimeout(() => {

        filterCards();

      }, 220);

    }
  );
rubricaFilter?.addEventListener(
  "change",
  filterCards
);
  
  genreFilter?.addEventListener(
    "change",
    filterCards
  );

  ratingFilter?.addEventListener(
    "change",
    filterCards
  );

}
