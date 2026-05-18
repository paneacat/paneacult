const loginForm =
  document.querySelector(".login-form");

const registerBtn =
  document.querySelector(".register-btn");

const logoutBtn =
  document.querySelector(".logout-btn");


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

registerBtn?.addEventListener(
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


/* LOGOUT */

logoutBtn?.addEventListener(
  "click",
  async () => {

    await supabaseClient.auth.signOut();

    window.location.href =
      "login.html";

  }
);
