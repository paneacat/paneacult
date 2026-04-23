document.addEventListener("DOMContentLoaded", () => {

  const filtri = document.querySelectorAll('.filtro');
  const cards = document.querySelectorAll('.card');

  console.log("Filtri:", filtri.length);
  console.log("Cards:", cards.length);

  let filtriAttivi = {
    categoria: "tutti",
    genere: "tutti"
  };

  filtri.forEach(filtro => {
    filtro.addEventListener('click', () => {

      const tipo = filtro.dataset.tipo;
      const valore = filtro.dataset.valore;

      document.querySelectorAll(`.filtro[data-tipo="${tipo}"]`)
        .forEach(f => f.classList.remove('attivo'));

      filtro.classList.add('attivo');
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

   card.style.display = (matchCategoria && matchGenere)
  ? ""
  : "none";
    });
  }

});
