document.addEventListener('DOMContentLoaded', () => {

  // ===============================
  // ===== FILTRI
  // ===============================
  const bottoni = document.querySelectorAll('.filtro');
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

    if (bottoni.length) {
      bottoni.forEach(btn => {
        btn.addEventListener('click', () => {

          const filtro = norm(btn.dataset.filter);

          if (btn.closest('.top')) {
            filtroCategoria = filtro;
            document.querySelectorAll('.top .filtro')
              .forEach(b => b.classList.remove('attivo'));
          } else {
            filtroGenere = filtro;
            document.querySelectorAll('.bottom .filtro')
              .forEach(b => b.classList.remove('attivo'));
          }

          btn.classList.add('attivo');

          visibiliMax = STEP;
          aggiornaFiltri();
        });
      });
    }

    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        visibiliMax += STEP;
        aggiornaFiltri();
      });
    }

    aggiornaFiltri();
  }

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
