const filtri = document.querySelectorAll('.filtro');
const generi = document.querySelectorAll('.genere');
const cards = document.querySelectorAll('.card');

// CATEGORIE
filtri.forEach(btn => {
  btn.addEventListener('click', () => {

    filtri.forEach(b => b.classList.remove('attivo'));
    btn.classList.add('attivo');

    const filtro = btn.dataset.filter;

    cards.forEach(card => {
      const categoria = card.dataset.categoria;

      if (filtro === "tutti" || categoria === filtro) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });

  });
});

// GENERI
generi.forEach(btn => {
  btn.addEventListener('click', () => {

    generi.forEach(b => b.classList.remove('attivo'));
    btn.classList.add('attivo');

    const genere = btn.dataset.genere;

    cards.forEach(card => {
      const cardGenere = card.dataset.genere;

      if (genere === "tutti" || cardGenere.includes(genere)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });

  });
});
