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

    // aggiorna stato
    filtriAttivi[tipo] = valore;

    // UI attivo (solo nel gruppo corretto)
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

    const matchCategoria =
      filtriAttivi.categoria === "tutti" ||
      categoria === filtriAttivi.categoria;

    const matchGenere =
      filtriAttivi.genere === "tutti" ||
      genere.includes(filtriAttivi.genere);

    if (matchCategoria && matchGenere) {
      card.style.display = "";
    } else {
      card.style.display = "";
    }
  });
}
const elements = document.querySelectorAll('.fade-in');

function revealOnScroll() {
  const trigger = window.innerHeight * 0.9;

  elements.forEach((el, index) => {
    const top = el.getBoundingClientRect().top;

    if (top < trigger) {
      setTimeout(() => {
        el.classList.add('visible');
      }, index * 80); // 👈 ritmo tra le card
    }
  });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);
function revealOnScroll() {
  const trigger = window.innerHeight * 0.9;

  elements.forEach(el => {
    const top = el.getBoundingClientRect().top;

    if (top < trigger) {
      el.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);
const filtri = document.querySelectorAll(".filtro");

filtri.forEach(btn => {
  btn.addEventListener("click", () => {

    // se è già attivo → togli
    if (btn.classList.contains("attivo")) {
      btn.classList.remove("attivo");
      return;
    }

    // altrimenti: resetta tutti
    filtri.forEach(b => b.classList.remove("attivo"));

    // attiva solo quello cliccato
    btn.classList.add("attivo");
  });
});
