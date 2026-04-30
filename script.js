document.addEventListener('DOMContentLoaded', () => {

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

  // ===== CLICK =====
  bottoni.forEach(btn => {
    btn.addEventListener('click', () => {

      const filtro = norm(btn.dataset.filter);

      // capisce se è categoria o genere
      if (btn.closest('.top')) {
        filtroCategoria = filtro;

        // reset attivi categoria
        document.querySelectorAll('.top .filtro')
          .forEach(b => b.classList.remove('attivo'));

      } else {
        filtroGenere = filtro;

        // reset attivi genere
        document.querySelectorAll('.bottom .filtro')
          .forEach(b => b.classList.remove('attivo'));
      }

      btn.classList.add('attivo');

      // reset load more
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
const slider = document.querySelector('.slider');

document.querySelector('.next').onclick = () => {
  slider.scrollBy({ left: 300, behavior: 'smooth' });
};

document.querySelector('.prev').onclick = () => {
  slider.scrollBy({ left: -300, behavior: 'smooth' });
};                  

const slider = document.querySelector('.slider');
const next = document.querySelector('.slider-btn.next');
const prev = document.querySelector('.slider-btn.prev');

const scrollAmount = 360; // distanza di scorrimento

next.addEventListener('click', () => {
  slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
});

prev.addEventListener('click', () => {
  slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
});
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

    // mostra progressiva
    filtrati.forEach((card, i) => {
      card.style.display = i < visibiliMax ? "block" : "none";
    });

    // empty state
    if (empty) {
      if (filtrati.length === 0) {
        empty.style.display = "block";
        empty.classList.add("show");
      } else {
        empty.classList.remove("show");
        empty.style.display = "none";
      }
    }

    // load more visibilità
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

  // ===== INIT =====
  aggiornaFiltri();

});
