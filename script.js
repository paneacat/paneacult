document.addEventListener("DOMContentLoaded", () => {

  // ===============================
  // ===== CUSTOM CURSOR
  // ===============================

  const cursor =
    document.querySelector(".cursor");

  if(cursor){

    document.addEventListener("mousemove", (e) => {

      cursor.style.left = e.clientX + "px";

      cursor.style.top = e.clientY + "px";

    });

  }

  // ===============================
  // ===== FILTRI ARCHIVIO
  // ===============================

  const cards =
    document.querySelectorAll(".archivio-card");

  const categoryFilter =
    document.getElementById("categoryFilter");

  const genreFilter =
    document.getElementById("genreFilter");

  const emptyState =
    document.getElementById("emptyState");

  const loadMoreBtn =
    document.getElementById("loadMoreBtn");

  const resetBtn =
    document.getElementById("resetFilters");

  let visibleCards = 3;

  /* =========================
   UPDATE FILTRI
========================= */

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
      matchCategory && matchGenre;

    if(visible){

      totalVisible++;

      if(totalVisible <= visibleCards){

        card.style.display = "block";

      }

      else {

        card.style.display = "none";

      }

    }

    else {

      card.style.display = "none";

    }

  });

  /* EMPTY STATE */

  if(emptyState){

    if(totalVisible === 0){

      emptyState.classList.add(
        "show"
      );

    }

    else {

      emptyState.classList.remove(
        "show"
      );

    }

  }

  /* LOAD MORE */

  if(loadMoreBtn){

    if(totalVisible <= visibleCards){

      loadMoreBtn.style.display =
        "none";

    }

    else {

      loadMoreBtn.style.display =
        "flex";

    }

  }

}

  /* =========================
     EVENT FILTRI
  ========================= */

  if(categoryFilter){

    categoryFilter.addEventListener(
      "change",
      () => {

        visibleCards = 3;

        aggiornaFiltri();

      }
    );

  }

  if(genreFilter){

    genreFilter.addEventListener(
      "change",
      () => {

        visibleCards = 3;
        aggiornaFiltri();

      }
    );

  }

  /* =========================
     RESET FILTRI
  ========================= */

  if(resetBtn){

    resetBtn.addEventListener("click", () => {

      if(categoryFilter){

        categoryFilter.value = "all";

      }

      if(genreFilter){

        genreFilter.value = "all";

      }

      
    visibleCards = 3;

      aggiornaFiltri();

    });

  }

  /* =========================
     LOAD MORE
  ========================= */

  if(loadMoreBtn){

  loadMoreBtn.addEventListener("click", () => {

    visibleCards += 3;
    aggiornaFiltri();

  });

  }
  aggiornaFiltri();
  // ===============================
  // ===== SPLASH
  // ===============================

  const splash =
    document.getElementById("splash");

  if(splash){

    setTimeout(() => {

      splash.style.opacity = "0";

      splash.style.transition = "3.5s";

      setTimeout(() => {

        splash.remove();

      }, 400);

    }, 400);

  }

  // ===============================
  // ===== SLIDER
  // ===============================

  const slider =
    document.getElementById("slider");

  const next =
    document.getElementById("next");

  const prev =
    document.getElementById("prev");

  if(slider && next && prev){

    function updateArrows(){

      const maxScroll =
        slider.scrollWidth - slider.clientWidth;

      if(slider.scrollLeft >= maxScroll - 10){

        prev.style.opacity = "1";

        prev.style.pointerEvents = "auto";

      } else {

        prev.style.opacity = "0";

        prev.style.pointerEvents = "none";

      }

    }

    next.addEventListener("click", () => {

      slider.scrollBy({
        left: slider.clientWidth,
        behavior: "smooth"
      });

    });

    prev.addEventListener("click", () => {

      slider.scrollTo({
        left: 0,
        behavior: "smooth"
      });

    });

    slider.addEventListener(
      "scroll",
      updateArrows
    );

    updateArrows();

  }

  // ===============================
  // ===== CREDITS
  // ===============================

  const credits =
    document.querySelector(".credits");

  if(credits){

    const observer =
      new IntersectionObserver(entries => {

        entries.forEach(entry => {

          if(entry.isIntersecting){

            credits.classList.add("show");

          }

        });

      }, {
        threshold: 0.2
      });

    observer.observe(credits);

  }

  // ===============================
  // ===== FADE-UP
  // ===============================

  const elements =
    document.querySelectorAll(".fade-up");

  if(elements.length){

    setTimeout(() => {

      elements.forEach(el => {

        el.classList.add("show");

      });

    }, 200);

    const observerFade =
      new IntersectionObserver(entries => {

        entries.forEach(entry => {

          if(entry.isIntersecting){

            entry.target.classList.add("show");

          }

        });

      }, {
        threshold: 0.2
      });

    elements.forEach(el => {

      observerFade.observe(el);

    });

  }

});
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

let selectedMovieData = null;

if(movieSearchInput){

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
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`
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
            () => {

              selectedMovieData = movie;

              selectedMovie.innerHTML = `
              
                <div class="selected-movie-card">

                  <img
                    src="https://image.tmdb.org/t/p/w300${movie.poster_path}"
                    alt="${movie.title}"
                  >

                  <div>

                    <h2>
                      ${movie.title}
                    </h2>

                    <p>
                      ${movie.release_date?.slice(0,4) || ""}
                    </p>

                  </div>

                </div>

              `;

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
