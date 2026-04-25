document.addEventListener('DOMContentLoaded', () => {

  // ===== ELEMENTI =====
  const bottoniCategoria = document.querySelectorAll('[data-filter]');
  const bottoniGenere = document.querySelectorAll('[data-genere]');
  const cards = document.querySelectorAll('.card');
  const empty = document.getElementById('emptyState');
  // ===== STATI =====
  let filtroCategoria = "tutti";
  let filtroGenere = "tutti";

  // ===== CATEGORIE =====
  bottoniCategoria.forEach(btn => {
    btn.addEventListener('click', () => {

      filtroCategoria = btn.dataset.filter;

      bottoniCategoria.forEach(b => b.classList.remove('attivo'));
      btn.classList.add('attivo');

      aggiornaFiltri();
    });
  });

  // ===== GENERI =====
  bottoniGenere.forEach(btn => {
    btn.addEventListener('click', () => {

      filtroGenere = btn.dataset.genere;

      bottoniGenere.forEach(b => b.classList.remove('attivo'));
      btn.classList.add('attivo');

      aggiornaFiltri();
    });
  });

  // ===== FILTRO COMBINATO =====
  function aggiornaFiltri() {

    let visibili = 0;

    cards.forEach(card => {

      const categoria = card.dataset.categoria;
      const generi = (card.dataset.genere || "").split(" ");

      const matchCategoria =
        filtroCategoria === "tutti" || categoria === filtroCategoria;

      const matchGenere =
        filtroGenere === "tutti" || generi.includes(filtroGenere);

      if (matchCategoria && matchGenere) {
  card.classList.remove("hide");
  visibili++;
} else {
  card.classList.add("hide");
      }

    });

    // ===== EMPTY STATE =====
    if (empty) {
  if (visibili === 0) {
    empty.style.display = "block";
  } else {
    empty.style.display = "none";
  }
    }
  }

});
