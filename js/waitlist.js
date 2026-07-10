const nameInput = document.getElementById("waitlist-name");
const form = document.getElementById("waitlist-form");
const emailInput = document.getElementById("waitlist-email");
const message = document.getElementById("waitlist-message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim().toLowerCase();

  if (!email) return;

  const name = nameInput.value.trim();

const { error } = await supabaseClient
  .from("waitlist")
  .insert([
    {
      name,
      email
    }
  ]);
  
  if (error) {
    if (error.code === "23505") {
      message.textContent = "✨ Sei già nella lista d'attesa!";
    } else {
      message.textContent = "⚠️ Errore. Riprova più tardi.";
      console.error(error);
    }
    return;
  }

  message.textContent = "🎉 Benvenuto! Sei nella lista d'attesa.";
  form.reset();
});
