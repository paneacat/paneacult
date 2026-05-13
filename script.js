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

  let visibleCards =
  window.innerWidth <= 768
    ? 4
    : 6;

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

    let visibleCount = 0;

    cards.forEach(card => {

      const categories =
        card.dataset.category.split(" ");

      const matchCategory =
        category === "all" ||
        categories.includes(category);

      const matchGenre =
        genre === "all" ||
        categories.includes(genre);

      const visible =
        matchCategory && matchGenre;

      if(visible){

        visibleCount++;

        if(visibleCount <= visibleCards){

          card.style.display = "";

        } else {

          card.style.display = "none";

        }

      } else {

        card.style.display = "none";

      }

    });

    /* EMPTY STATE */

    if(emptyState){

      if(visibleCount === 0){

        emptyState.classList.add("show");

      } else {

        emptyState.classList.remove("show");

      }

    }

    /* LOAD MORE */

    if(loadMoreBtn){

      if(visibleCount <= visibleCards){

        loadMoreBtn.style.display = "none";

      } else {

        loadMoreBtn.style.display = "flex";

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

        visibleCards =
  window.innerWidth <= 768
    ? 4
    : 6;

        aggiornaFiltri();

      }
    );

  }

  if(genreFilter){

    genreFilter.addEventListener(
      "change",
      () => {

        visibleCards =
  window.innerWidth <= 768
    ? 4
    : 6;
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

      visibleCards =
  window.innerWidth <= 768
    ? 4
    : 6;

      aggiornaFiltri();

    });

  }

  /* =========================
     LOAD MORE
  ========================= */

  if(loadMoreBtn){

    loadMoreBtn.addEventListener("click", () => {

      visibleCards +=
  window.innerWidth <= 768
    ? 4
    : 6;

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
