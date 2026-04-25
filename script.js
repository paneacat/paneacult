const filtri = document.querySelectorAll('.filtro');
const generi = document.querySelectorAll('.genere');
const cards = document.querySelectorAll('.card');

let filtroAttivo = "tutti";
let genereAttivo = "tutti";

// CATEGORIE
filtri.forEach(btn => {
  btn.addEventListener('click', () => {

    filtri.forEach(b => b.classList.remove('attivo'));
    btn.classList.add('attivo');

    filtroAttivo = btn.dataset.filter;

    aggiorna();
  });
});

// GENERI
generi.forEach(btn => {
  btn.addEventListener('click', () => {

    generi.forEach(b => b.classList.remove('attivo'));
    btn.classList.add('attivo');

    genereAttivo = btn.dataset.genere;

    aggiorna();
  });
});

function aggiorna() {
  cards.forEach(card => {
    const categoria = card.dataset.categoria;
    const genere = card.dataset.genere;

    const okCategoria =
      filtroAttivo === "tutti" || categoria === filtroAttivo;

    const okGenere =
      genereAttivo === "tutti" || genere.includes(genereAttivo);

    if (okCategoria && okGenere) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}
