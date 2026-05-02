document.addEventListener('DOMContentLoaded', () => {

  // ===== ELEMENTI =====
  const bottoni = document.querySelectorAll('.filtro');
  const cards = Array.from(document.querySelectorAll('.card'));
  const empty = document.getElementById('emptyState');
  const loadMoreBtn = document.getElementById('loadMoreBtn');

  let filtroCategoria = "tutti";
  let filtroGenere = "tutti";

  function getStep() {
    return window.innerWidth >= 900 ? 3 : 4;
  }

  let step = getStep();
  let visibiliMax = step;

  const norm = (v) => (v || "").trim().toLowerCase();

  // ===== CLICK FILTRI =====
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

      step = getStep();
      visibiliMax = step;

      aggiornaFiltri();
    });
  });

  // ===== LOAD MORE =====
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      visibiliMax += step;
      aggiornaFiltri();
    });
  }

  // ===== FILTRO =====
  function aggiornaFiltri() {
    let filtrati = [];

    cards.forEach(card => {

      const categoria = norm(card.dataset.categoria);

      const generi = (card.dataset.genere || "")
        .split(" ")
        .map(g => g.trim().toLowerCase())
        .filter(Boolean);

      const matchCategoria =
        filtroCategoria === "tutti" || categoria === filtroCategoria;

      const matchGenere =
        filtroGenere === "tutti" || generi.includes(filtroGenere);

      if (matchCategoria && matchGenere) {
        filtrati.push(card);
      } else {
        card.style.display = "none";
      }
    });

    filtrati.forEach((card, i) => {
      card.style.display = i < visibiliMax ? "block" : "none";
    });

    if (empty) {
      empty.style.display = filtrati.length === 0 ? "block" : "none";
      empty.classList.toggle("show", filtrati.length === 0);
    }

    if (loadMoreBtn) {
      loadMoreBtn.style.display =
        filtrati.length > visibiliMax ? "inline-block" : "none";
    }
  }

  // ===== RESIZE =====
  window.addEventListener('resize', () => {
    const newStep = getStep();

    if (newStep !== step) {
      step = newStep;
      visibiliMax = step;
      aggiornaFiltri();
    }
  });

  // ===== INIT FILTRI =====
  aggiornaFiltri();

  // ===== 🎬 CINEMA SLIDER =====
  function initCinema() {
    const slider = document.querySelector('.slider');
    const slideCards = Array.from(document.querySelectorAll('.slide-card, .slide-card-cta'));

    if (!slider || slideCards.length === 0) return;

    function updateActive() {
      const center = slider.getBoundingClientRect().left + slider.clientWidth / 2;

      let closest = null;
      let minOffset = Infinity;

      slideCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;

        const offset = Math.abs(center - cardCenter);

        if (offset < minOffset) {
          minOffset = offset;
          closest = card;
        }
      });

      slideCards.forEach(card => {
        card.classList.remove('is-active', 'is-near');
      });

      if (!closest) return;

      closest.classList.add('is-active');

      const index = slideCards.indexOf(closest);

      if (slideCards[index - 1]) {
        slideCards[index - 1].classList.add('is-near');
      }

      if (slideCards[index + 1]) {
        slideCards[index + 1].classList.add('is-near');
      }
    }

    function snapToClosest() {
      const center = slider.scrollLeft + slider.clientWidth / 2;

      let closest = null;
      let minOffset = Infinity;

      slideCards.forEach(card => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const offset = Math.abs(center - cardCenter);

        if (offset < minOffset) {
          minOffset = offset;
          closest = card;
        }
      });

      if (closest) {
        const target =
          closest.offsetLeft - (slider.clientWidth / 2 - closest.offsetWidth / 2);

        slider.scrollTo({
          left: target,
          behavior: "smooth"
        });
      }
    }

    let scrollTimeout;

    slider.addEventListener('scroll', () => {
      updateActive();

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(snapToClosest, 120);
    });

    // init
    setTimeout(updateActive, 100);
  }

  if (window.innerWidth >= 900) {
    initCinema();
  }

});
