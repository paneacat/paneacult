
/* =========================
   CHECK SESSIONE
========================= */

async function checkSession(){

  const {
    data: { session }
  } =
  await supabaseClient.auth.getSession();

  /* LOGGATO */

  if(session){

    document.body.classList.add(
      "logged-user"
    );

    if(enterBtn){

      enterBtn.innerText =
        "Vai al tuo archivio";

      enterBtn.href =
        "profilo.html";

    }

  }

  /* NON LOGGATO */

  else {

    document.body.classList.add(
      "guest-user"
    );

    /* BOTTONE WELCOME */

    if(enterBtn){

      enterBtn.innerText =
        "Accedi a paneacult";

      enterBtn.href =
        "login.html";

    }

    /* BOTTONI FILM */

    saveBtns.forEach(btn => {

      btn.addEventListener(
        "click",
        () => {

          window.location.href =
            "login.html";

        }
      );

    });

  }

}

checkSession();



/* =========================
   LOGIN
========================= */

const loginForm =
  document.querySelector(".login-form");

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

      alert(error.message);

    } else {

      window.location.href =
        "profilo.html";

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
  password,

  options: {

    emailRedirectTo:
  "https://paneacult.com/profilo.html"

  }

});

    if(error){

      alert(error.message);

    }

    else {

      alert(
        "Controlla la tua email ✨"
      );

    }

  }
});
  


/* =========================
   LOGOUT
========================= */

logoutBtn?.addEventListener(
  "click",
  async () => {

    await supabaseClient.auth.signOut();

    window.location.href =
      "login.html";

  }
);



/* =========================
   LOAD PROFILE
========================= */

async function loadProfile(){

  const {
    data: { user }
  } =
  await supabaseClient.auth.getUser();

  const profileEmail =
    document.getElementById(
      "profileEmail"
    );

  if(!profileEmail){

    return;

  }

  if(!user){

    window.location.href =
      "profilo.html";

    return;

  }

  profileEmail.textContent =
    user.email;

}

loadProfile();


document.addEventListener("DOMContentLoaded", async () => {
const {
  data: { session }
} = await supabaseClient.auth.getSession();

if(
  session &&
  window.location.pathname.includes("login")
){

  window.location.href =
    "/profilo.html";

  return;
}


const googleLoginBtn =
  document.getElementById(
    "googleLoginBtn"
  );

googleLoginBtn?.addEventListener(
  "click",
  async () => {

    await supabaseClient
      .auth
      .signInWithOAuth({

        provider: "google",

        options: {

          redirectTo:
            "https://paneacult.com/profilo.html"

        }

      });

  }
);

});
