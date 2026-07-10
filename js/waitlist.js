const nameInput = document.getElementById("waitlist-name");
const form = document.getElementById("waitlist-form");
const emailInput = document.getElementById("waitlist-email");
const message = document.getElementById("waitlist-message");
const membersCount = document.getElementById("members-count");

// Carica il numero di iscritti
async function loadCount() {
  const { count, error } = await supabaseClient
    .from("waitlist")
    .select("*", {
      count: "exact",
      head: true
    });

  if (!error) {
    membersCount.textContent =
      `🎬 ${count} appassionati sono già nella lista d'attesa`;
  } else {
    membersCount.textContent = "";
    console.error(error);
  }
}

// Carica il contatore all'apertura della pagina
loadCount();

// Gestione iscrizione
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();

  if (!name || !email) return;

  message.textContent = "⏳ Ti stiamo iscrivendo...";

  const { error } = await supabaseClient
    .from("waitlist")
    .insert([
      {
        name,
        email
      }
    ]);

  if (error) {

    // Email già presente
    if (error.code === "23505") {
      message.textContent =
        "✨ Sei già nella lista d'attesa!";
    } else {
      message.textContent =
        "⚠️ Qualcosa è andato storto. Riprova più tardi.";
      console.error(error);
    }

    return;
  }

  message.textContent =
    "🎉 Perfetto! Ti avviseremo il giorno del lancio.";

  form.reset();

  // Aggiorna il numero degli iscritti
  loadCount();

});
