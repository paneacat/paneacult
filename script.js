// ===== FILTRI =====
const filtri = document.querySelectorAll('.filtro');
const cards = document.querySelectorAll('.card');

let filtriAttivi = {
  categoria: "tutti",
  genere: "tutti"
};

filtri.forEach(filtro => {
  filtro.addEventListener('click', () => {

    const tipo = filtro.dataset.tipo;
    const valore = filtro.dataset.valore;

    // reset gruppo (categoria o genere)
    document.querySelectorAll(`.filtro[data-tipo="${tipo}"]`)
      .forEach(f => f.classList.remove('attivo'));

    // attiva quello cliccato
    filtro.classList.add('attivo');

    // salva stato
    filtriAttivi[tipo] = valore;

    aggiornaFiltri();
  });
});

function aggiornaFiltri() {
  cards.forEach(card => {

    const categoria = card.dataset.categoria;
    const genere = card.dataset.genere || "";

    const matchCategoria =
      filtriAttivi.categoria === "tutti" ||
      categoria === filtriAttivi.categoria;

    const matchGenere =
      filtriAttivi.genere === "tutti" ||
      genere.includes(filtriAttivi.genere);

    if (matchCategoria && matchGenere) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// ===== DEBUG (temporaneo) =====
console.log("Filtri trovati:", filtri.length);
console.log("Card trovate:", cards.length);
