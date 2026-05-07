document.addEventListener("DOMContentLoaded", () => {

  // ===============================
  // ===== FILTRI ARCHIVIO
  // ===============================
const cards = document.querySelectorAll(".archivio-card");

const filterButtons = document.querySelectorAll(".filter-btn");

const emptyState = document.getElementById("emptyState");

let activeCategory = "all";
let activeGenres = [];

/* =========================
   CLICK FILTRI
========================= */

filterButtons.forEach(button => {

  button.addEventListener("click", () => {

    const filter = button.dataset.filter;

    /* =========================
       RUBRICHE
    ========================= */

    if(
      filter === "all" ||
      filter === "cinema-che-resta" ||
      filter === "sguardi-contemporanei"
    ){

      activeCategory = filter;

      document
        .querySelectorAll(
          '[data-filter="all"], [data-filter="cinema-che-resta"], [data-filter="sguardi-contemporanei"]'
        )
        .forEach(btn => btn.classList.remove("active"));

      button.classList.add("active");
    }

    /* =========================
       GENERI
    ========================= */

    else {

      if(activeGenres.includes(filter)){

        activeGenres =
          activeGenres.filter(g => g !== filter);

        button.classList.remove("active");

      } else {

        activeGenres.push(filter);

        button.classList.add("active");
      }
    }

    aggiornaFiltri();
  });

});

/* =========================
   UPDATE
========================= */

function aggiornaFiltri(){

  let visibleCount = 0;

  cards.forEach(card => {

    const categories =
      card.dataset.category.split(" ");

    /* rubrica */

    const matchCategory =
      activeCategory === "all" ||
      categories.includes(activeCategory);

    /* generi */

    const matchGenres =
      activeGenres.length === 0 ||
      activeGenres.every(g =>
        categories.includes(g)
      );

    const visible =
      matchCategory && matchGenres;

    card.style.display =
      visible ? "block" : "none";

    if(visible){
      visibleCount++;
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

}

/* =========================
   RESET
========================= */

const resetBtn =
  document.getElementById("resetFilters");

if(resetBtn){

  resetBtn.addEventListener("click", () => {

    activeCategory = "all";

    activeGenres = [];

    filterButtons.forEach(btn =>
      btn.classList.remove("active")
    );

    document
      .querySelector('[data-filter="all"]')
      .classList.add("active");

    aggiornaFiltri();

  });

}

  // ===============================
  // ===== MENU FILTRI A TENDINA
  // ===============================

  const filtersToggle = document.querySelector(".filters-toggle");
  const filtersWrapper = document.querySelector(".filters-wrapper");

  if (filtersToggle && filtersWrapper) {

    filtersToggle.addEventListener("click", () => {
      filtersWrapper.classList.toggle("active");
    });

  }

  // ===============================
  // ===== SPLASH
  // ===============================

  const splash = document.getElementById("splash");

  if (splash) {

    setTimeout(() => {

      splash.style.opacity = "0";
      splash.style.transition = "0.4s";

      setTimeout(() => {
        splash.remove();
      }, 400);

    }, 400);

  }

  // ===============================
  // ===== SLIDER
  // ===============================

  const slider = document.getElementById("slider");
  const next = document.getElementById("next");
  const prev = document.getElementById("prev");

  if (slider && next && prev) {

    function updateArrows() {

      const maxScroll =
        slider.scrollWidth - slider.clientWidth;

      if (slider.scrollLeft >= maxScroll - 10) {

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

    slider.addEventListener("scroll", updateArrows);

    updateArrows();
  }

  // ===============================
  // ===== CREDITS
  // ===============================

  /* =========================
   CREDITS SCROLL
========================= */

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

    },{
      threshold:.2
    });

  observer.observe(credits);

}
  // ===============================
  // ===== FADE-UP
  // ===============================

  const elements = document.querySelectorAll(".fade-up");

  if (elements.length) {

    setTimeout(() => {

      elements.forEach(el => {
        el.classList.add("show");
      });

    }, 200);

    const observerFade = new IntersectionObserver(entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }

      });

    }, {
      threshold: 0.2
    });

    elements.forEach(el => observerFade.observe(el));
  }

});
