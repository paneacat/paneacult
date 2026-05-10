const supabaseUrl =
  "https://czvtirkuyhcilmzbwysf.supabase.co";

const supabaseKey =
  "TUA_KEY";

const supabaseClient =
  supabase.createClient(
    supabaseUrl,
    supabaseKey
  );

/* =========================
   BOTTONI
========================= */

const loginBtn =
  document.querySelector(".login-btn");

const registerBtn =
  document.querySelector(".register-btn");

/* =========================
   LOGIN
========================= */

loginBtn?.addEventListener(
  "click",
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
      await supabaseClient
      .auth
      .signInWithPassword({

        email,
        password

      });

    if(error){

      alert(error.message);

    } else {

      window.location.href =
        "index.html";

    }

  }
);

/* =========================
   REGISTER
========================= */

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
      await supabaseClient
      .auth
      .signUp({

        email,
        password

      });

    if(error){

      alert(error.message);

    } else {

      alert(
        "Controlla la tua email ✨"
      );

    }

  }
);

/* =========================
   SESSIONE
========================= */

supabaseClient.auth
.getSession()

.then(({ data }) => {

  if(data.session){

    console.log(
      "utente loggato"
    );

  }

});
