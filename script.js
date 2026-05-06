document.addEventListener('DOMContentLoaded', () => {

 
  const cards = Array.from(document.querySelectorAll('.card-film'));
  const empty = document.getElementById('emptyState');
  const loadMoreBtn = document.getElementById('loadMoreBtn');

  if (cards.length) {

    let filtroCategoria = "tutti";
    let filtroGenere = "tutti";

    const norm = (v) => (v || "").trim().toLowerCase();

    const STEP = 3;
    let visibiliMax = STEP;

    function aggiornaFiltri() {
      let filtrati = [];

      cards.forEach(card => {
        const categoria = norm(card.dataset.categoria);
        const generi = norm(card.dataset.genere).split(" ").filter(Boolean);

        const matchCategoria =
          filtroCategoria === "tutti" || categoria === filtroCategoria;

        const matchGenere =
          filtroGenere === "tutti" || generi.includes(filtroGenere);

        const visibile = matchCategoria && matchGenere;

        card.classList.toggle("hidden", !visibile);

        if (visibile) filtrati.push(card);
      });

      filtrati.forEach((card, i) => {
        card.classList.toggle("hidden-by-limit", i >= visibiliMax);
      });

      if (empty) {
        empty.classList.toggle("show", filtrati.length === 0);
      }

      if (loadMoreBtn) {
        loadMoreBtn.style.display =
          filtrati.length > visibiliMax ? "inline-block" : "none";
      }
    }

    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        visibiliMax += STEP;
        aggiornaFiltri();
      });
    }

    aggiornaFiltri();
  }
document.addEventListener("DOMContentLoaded", () => {
  const splash = document.getElementById("splash");
  if (splash) {
    setTimeout(() => {
      splash.style.opacity = "0";
      splash.style.transition = "0.4s";
      setTimeout(() => splash.remove(), 400);
    }, 400);
  }
});

 setTimeout(() => {
  const splash = document.getElementById("splash");
  if (splash) splash.remove();
}, 1500);
  // ===============================
  // ===== SLIDER 🔥 (FIX VERO)
  // ===============================
  const slider = document.getElementById("slider");
  const next = document.getElementById("next");
  const prev = document.getElementById("prev");

  if (slider && next && prev) {

    function updateArrows() {
      const maxScroll = slider.scrollWidth - slider.clientWidth;

      // ← compare solo alla fine
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

    // stato iniziale
    updateArrows();
  }

  // ===============================
  // ===== CREDITS
  // ===============================
  const credits = document.querySelector('.credits');

  if (credits) {
    const observerCredits = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          credits.classList.add('show');
        }
      });
    }, { threshold: 0.3 });

    observerCredits.observe(credits);
  }

  // ===============================
  // ===== FADE-UP
  // ===============================
  const elements = document.querySelectorAll('.fade-up');

  if (elements.length) {

    setTimeout(() => {
      elements.forEach(el => el.classList.add('show'));
    }, 200);

    const observerFade = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, { threshold: 0.2 });

    elements.forEach(el => observerFade.observe(el));
  }

});
const openFilters = document.getElementById("openFilters");
const filtersWrapper = document.getElementById("filtersWrapper");

if(openFilters && filtersWrapper){

  openFilters.addEventListener("click", () => {
    filtersWrapper.classList.toggle("open");
  });

}
const toggle = document.querySelector('.filters-toggle');
const dropdown = document.querySelector('.filters-dropdown');

toggle.addEventListener('click', () => {
  dropdown.classList.toggle('active');
});

document.addEventListener('click', (e) => {

  if(!e.target.closest('.filters-wrapper')){
    dropdown.classList.remove('active');
  }

});
