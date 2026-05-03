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
// ===== SNAP AUTOMATICO SLIDER =====

function initSliderSnap() {
  const slider = document.querySelector('.slider');
  const items = Array.from(document.querySelectorAll('.slide-item'));

  if (!slider || items.length === 0) {
    console.log("❌ slider non trovato");
    return;
  }

  console.log("✅ slider attivo");

  let timeout;

  function snapToClosest() {
    const center = slider.scrollLeft + slider.clientWidth / 2;

    let closest = null;
    let minOffset = Infinity;

    items.forEach(item => {
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const offset = Math.abs(center - itemCenter);

      if (offset < minOffset) {
        minOffset = offset;
        closest = item;
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

  // scroll con debounce migliorato
  slider.addEventListener('scroll', () => {
    clearTimeout(timeout);
    timeout = setTimeout(snapToClosest, 100);
  });

  // snap anche quando finisci di scrollare (più affidabile)
  slider.addEventListener('touchend', snapToClosest);
  slider.addEventListener('mouseup', snapToClosest);
}


// ===== INIT SLIDER =====
function setupSlider() {
  if (window.innerWidth >= 900) {
    initSliderSnap();
  }
}

// avvio iniziale
setupSlider();

// riattiva su resize (🔥 importante)
window.addEventListener('resize', () => {
  setupSlider();
});
  // ===== INIT =====
  aggiornaFiltri();

});
