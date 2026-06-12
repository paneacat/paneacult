const loginForm =
  document.querySelector(".login-form");

const authRegisterBtn =
  document.querySelector(".register-btn");


/* LOGIN */

loginForm?.addEventListener(
  "submit",
  async (e) => {

    e.preventDefault();

    const email =
      document.querySelector(
        'input[type="email"]'
      ).value;

    const password =
      document.querySelector(
        'input[type="password"]'
      ).value;

    const { error } =
      await supabaseClient.auth
        .signInWithPassword({

          email,
          password

        });

    if(error){

      console.log(error);

      alert(error.message);

    }

    else {

      window.location.href =
        "profilo.html";

    }

  }
);


/* REGISTER */

authRegisterBtn?.addEventListener(
  "click",
  async () => {

    const email =
      document.querySelector(
        'input[type="email"]'
      ).value;

    const password =
      document.querySelector(
        'input[type="password"]'
      ).value;

    const { error } =
      await supabaseClient.auth
        .signUp({

          email,
          password,

          options: {

            emailRedirectTo:
              "https://paneacult.com/profilo.html"

          }

        });

    if(error){

      console.log(error);

      alert(error.message);

    }

    else {

      alert(
        "Controlla la tua email ✨"
      );

    }

  }
);


const PASSWORD = "PaneaCult2026!";

if (sessionStorage.getItem("authenticated") !== "true") {
  const password = prompt("Inserisci la password");

  if (password === PASSWORD) {
    sessionStorage.setItem("authenticated", "true");
  } else {
    document.body.innerHTML = "<h1>Accesso negato</h1>";
    throw new Error("Access denied");
  }
}
