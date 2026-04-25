const bottoniCategoria = document.querySelectorAll('[data-filter]');
const bottoniGenere = document.querySelectorAll('[data-genere]');
const cards = document.querySelectorAll('.card');

let filtroCategoria = "tutti";
let filtroGenere = "tutti";

// CATEGORIE
bottoniCategoria.forEach(btn => {
  btn.addEventListener('click', () => {
    filtroCategoria = btn.dataset.filter;

    bottoniCategoria.forEach(b => b.classList.remove('attivo'));
    btn.classList.add('attivo');

    aggiornaFiltri();
  });
});

// GENERI
bottoniGenere.forEach(btn => {
  btn.addEventListener('click', () => {
    filtroGenere = btn.dataset.genere;

    bottoniGenere.forEach(b => b.classList.remove('attivo'));
    btn.classList.add('attivo');

    aggiornaFiltri();
  });
});

// LOGICA
function aggiornaFiltri() {
  cards.forEach(card => {
    const categoria = card.dataset.categoria;
    const genere = card.dataset.genere;

    const matchCategoria =
      filtroCategoria === "tutti" || categoria === filtroCategoria;

    const matchGenere =
      filtroGenere === "tutti" || genere.includes(filtroGenere);

    if (matchCategoria && matchGenere) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}
