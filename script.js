<script>
document.addEventListener('DOMContentLoaded', () => {

  // ===============================
  // ===== FILTRI (solo se esistono)
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

    // click filtri SOLO se esistono
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

    // load more
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        visibiliMax += STEP;
        aggiornaFiltri();
      });
    }

    aggiornaFiltri();
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
</script>
