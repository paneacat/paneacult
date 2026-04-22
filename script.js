const filtri = document.querySelectorAll('.filtro');
const cards = document.querySelectorAll('.card');

filtri.forEach(filtro => {
  filtro.addEventListener('click', () => {

    filtri.forEach(f => f.classList.remove('attivo'));
    filtro.classList.add('attivo');

    const categoria = filtro.dataset.filtro;

    cards.forEach(card => {
      const tag = card.dataset.tag;
      card.style.display =
        (categoria === "tutti" || tag === categoria)
        ? "block"
        : "none";
    });
  });
});

function toggleMenu() {
  document.getElementById("menu").classList.toggle("active");
  document.querySelector(".hamburger").classList.toggle("active");
  document.getElementById("overlay").classList.toggle("active");
}
