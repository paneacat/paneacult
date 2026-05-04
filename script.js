<script>
document.addEventListener('DOMContentLoaded', () => {

  // ===== ELEMENTI =====
  const bottoni = document.querySelectorAll('.filtro');
  const cards = Array.from(document.querySelectorAll('.card-film'));
  const empty = document.getElementById('emptyState');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const slider = document.querySelector('.slider');

  let filtroCategoria = "tutti";
  let filtroGenere = "tutti";

  const norm = (v) => (v || "").trim().toLowerCase();

  // ===== MOSTRA SEMPRE 3 ALLA VOLTA =====
  const STEP = 3;
  let visibiliMax = STEP;

  // ===== FILTRI =====
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

    // limita a STEP
    filtrati.forEach((card, i) => {
      card.classList.toggle("hidden-by-limit", i >= visibiliMax);
    });

    // empty state
    if (empty) {
      empty.classList.toggle("show", filtrati.length === 0);
    }

    // bottone load more
    if (loadMoreBtn) {
      loadMoreBtn.style.display =
        filtrati.length > visibiliMax ? "inline-block" : "none";
    }
  }

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

      visibiliMax = STEP; // reset a 3
      aggiornaFiltri();
    });
  });

  // ===== LOAD MORE =====
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      visibiliMax += STEP;
      aggiornaFiltri();
    });
  }

  // ===== SLIDER (SE USATO) =====
  if (slider) {
    window.scrollSlider = function(direction) {
      const amount = slider.clientWidth * 0.8;

      slider.scrollBy({
        left: direction === 'next' ? amount : -amount,
        behavior: 'smooth'
      });
    };
  }

  // ===== INIT =====
  aggiornaFiltri();

});
</script>
