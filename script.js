document.addEventListener("DOMContentLoaded", () => {

  // ===============================
  // ===== FILTRI ARCHIVIO
  // ===============================

  const cards = Array.from(document.querySelectorAll(".archivio-card"));
  const empty = document.getElementById("emptyState");

  let filtroCategoria = "tutti";
  let filtroGenere = "tutti";

  const norm = (v) => (v || "").trim().toLowerCase();

  function aggiornaFiltri() {

    let trovati = 0;

    cards.forEach(card => {

      const categorie = norm(card.dataset.category).split(" ");

      const matchCategoria =
        filtroCategoria === "tutti" ||
        categorie.includes(filtroCategoria);

      const matchGenere =
        filtroGenere === "tutti" ||
        categorie.includes(filtroGenere);

      const visibile = matchCategoria && matchGenere;

      card.style.display = visibile ? "block" : "none";

      if (visibile) trovati++;
    });

    if (empty) {
      empty.classList.toggle("show", trovati === 0);
    }
  }

  // BOTTONI FILTRI
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach(button => {

    button.addEventListener("click", () => {

      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const filter = norm(button.dataset.filter);

      if (
        filter === "cinema" ||
        filter === "sguardi" ||
        filter === "tutti"
      ) {
        filtroCategoria = filter;
      } else {
        filtroGenere = filter;
      }

      aggiornaFiltri();
    });

  });

  // RESET
  const resetBtn = document.getElementById("resetFilters");

  if (resetBtn) {

    resetBtn.addEventListener("click", () => {

      filtroCategoria = "tutti";
      filtroGenere = "tutti";

      filterButtons.forEach(btn =>
        btn.classList.remove("active")
      );

      const tuttiBtn = document.querySelector(
        '.filter-btn[data-filter="tutti"]'
      );

      if (tuttiBtn) {
        tuttiBtn.classList.add("active");
      }

      aggiornaFiltri();
    });

  }

  aggiornaFiltri();

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

  const credits = document.querySelector(".credits");

  if (credits) {

    const observerCredits = new IntersectionObserver(entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {
          credits.classList.add("show");
        }

      });

    }, {
      threshold: 0.3
    });

    observerCredits.observe(credits);
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
