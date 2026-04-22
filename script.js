const filtri = document.querySelectorAll('.filtro');
const cards = document.querySelectorAll('.card');

let filtriAttivi = {
  categoria: "tutti",
  genere: "tutti",
  regista: "tutti"
};

filtri.forEach(filtro => {
  filtro.addEventListener('click', () => {

    const tipo = filtro.dataset.tipo;     // categoria / genere / regista
    const valore = filtro.dataset.valore;

    // aggiorna stato
    filtriAttivi[tipo] = valore;

    // UI attivo (solo nel gruppo giusto)
    document.querySelectorAll(`.filtro[data-tipo="${tipo}"]`)
      .forEach(f => f.classList.remove('attivo'));

    filtro.classList.add('attivo');

    aggiornaFiltri();
  });
});

function aggiornaFiltri() {
  cards.forEach(card => {

    const categoria = card.dataset.categoria;
    const genere = card.dataset.genere;
    const regista = card.dataset.regista;

    const matchCategoria =
      filtriAttivi.categoria === "tutti" ||
      categoria === filtriAttivi.categoria;

   const matchGenere =
  filtriAttivi.genere === "tutti" ||
  genere.includes(filtriAttivi.genere);

    const matchRegista =
      filtriAttivi.regista === "tutti" ||
      regista.includes(filtriAttivi.regista);

    if (matchCategoria && matchGenere && matchRegista) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}
