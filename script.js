document.addEventListener('DOMContentLoaded', () => {

  // ===============================
  // ===== FILTRI (NUOVO SISTEMA)
  // ===============================
  const buttons = document.querySelectorAll('.filter');
  const cards = document.querySelectorAll('.archivio-card');
  const resetBtn = document.getElementById('resetFilters');

  let activeFilters = {
    tipo: "all",
    genere: "all"
  };

  if (buttons.length && cards.length) {

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {

        const group = btn.dataset.group; // tipo / genere
        const filter = btn.dataset.filter;

        // reset gruppo
        document.querySelectorAll(`.filter[data-group="${group}"]`)
          .forEach(b => b.classList.remove('active'));

        btn.classList.add('active');

        activeFilters[group] = filter;

        filterCards();
      });
    });

    // ===== FUNZIONE FILTRI
    function filterCards() {
      cards.forEach(card => {

        const tags = (card.dataset.category || "").split(' ');

        const matchTipo =
          activeFilters.tipo === "all" ||
          tags.includes(activeFilters.tipo);

        const matchGenere =
          activeFilters.genere === "all" ||
          tags.includes(activeFilters.genere);

        if (matchTipo && matchGenere) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }

      });
    }

    // ===============================
    // ===== RESET FILTRI ↺
    // ===============================
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {

        // reset stato
        activeFilters.tipo = "all";
        activeFilters.genere = "all";

        // rimuove active da tutti
        buttons.forEach(btn => btn.classList.remove('active'));

        // riattiva "Tutti"
        document.querySelectorAll('.filter[data-group="tipo"][data-filter="all"]')
          .forEach(btn => btn.classList.add('active'));

        // mostra tutte le card
        cards.forEach(card => {
          card.style.display = "block";
        });

      });
    }

  }

  // ===============================
  // ===== SLIDER
  // ===============================
  const slider = document.getElementById("slider");
  const next = document.getElementById("next");
  const prev = document.getElementById("prev");

  if (slider && next && prev) {

    function updateArrows() {
      const maxScroll = slider.scrollWidth - slider.clientWidth;

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
  // ===== CREDITS (fade)
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
  // ===== FADE-UP GENERALE
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
