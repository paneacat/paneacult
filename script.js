const filtri = document.querySelectorAll(".filtro");
const cards = document.querySelectorAll(".card");

filtri.forEach(btn => {
  btn.addEventListener("click", () => {

    filtri.forEach(b => b.classList.remove("attivo"));
    btn.classList.add("attivo");

    const tipo = btn.dataset.tipo;
    const valore = btn.dataset.valore;

    cards.forEach(card => {

      if (valore === "tutti") {
        card.style.display = "block";
        return;
      }

      if (tipo === "categoria") {
        card.style.display =
          card.dataset.categoria === valore ? "block" : "none";
      }

      if (tipo === "genere") {
        card.style.display =
          card.dataset.genere.includes(valore) ? "block" : "none";
      }

    });
  });
});
