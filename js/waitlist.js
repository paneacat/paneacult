const honeypot = document.getElementById("website");
const nameInput = document.getElementById("waitlist-name");
const form = document.getElementById("waitlist-form");
const emailInput = document.getElementById("waitlist-email");
const message = document.getElementById("waitlist-message");
const membersCount = document.getElementById("members-count");

// Carica il numero di iscritti
async function loadCount() {

  const { data, error } = await supabaseClient
    .rpc("get_waitlist_count");

  if (error) {
    console.error(error);
    return;
  }

  membersCount.textContent =
    `🎬 ${data} appassionati sono già in lista d'attesa`;

}

loadCount();

// Gestione iscrizione
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (honeypot.value !== "") {
  return;
  }
  
  const name = nameInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();

  if (!name || !email) return;

  message.textContent = "⏳ Ti stiamo iscrivendo...";

  if (name.length < 2 || name.length > 50) {
  message.textContent = "Inserisci un nome valido.";
  return;
}

const emailRegex =
/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

if (!emailRegex.test(email)) {
  message.textContent = "Email non valida.";
  return;
}
  
  const { error } = await supabaseClient.rpc(
  "join_waitlist",
  {
    p_name: name,
    p_email: email
  }
);

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
