const supabaseUrl =
  "https://czvtirkuyhcilmzbwysf.supabase.co";

const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6dnRpcmt1eWhjaWxtemJ3eXNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczOTM1NjIsImV4cCI6MjA5Mjk2OTU2Mn0.v--ZBxJyMAIpb1bWbN6J3DUDi5FfcoOrhKccwRyuEvw";

const supabaseClient =
  supabase.createClient(
    supabaseUrl,
    supabaseKey
  );

/* =========================
   ELEMENTI
========================= */

const enterBtn =
  document.querySelector(
    ".welcome-btn.primary"
  );

const exploreBtn =
  document.querySelector(
    ".welcome-btn.secondary"
  );

const logoutBtn =
  document.querySelector(
    ".logout-btn"
  );

/* =========================
   CHECK SESSIONE
========================= */

async function checkSession(){

  const {
    data: { session }
  } =
  await supabaseClient.auth.getSession();

  /* =========================
     UTENTE LOGGATO
  ========================= */

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

  /* =========================
     UTENTE NON LOGGATO
  ========================= */

  else {

    document.body.classList.add(
      "guest-user"
    );

    if(enterBtn){

      enterBtn.innerText =
        "Accedi a paneacult";

      enterBtn.href =
        "login.html";

    }

  }

}

checkSession();

/* =========================
   PROFILO UTENTE
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

  /* SE NON È NEL PROFILO */

  if(!profileEmail){

    return;

  }

  /* NON LOGGATO */

  if(!user){

    window.location.href =
      "login.html";

    return;

  }

  /* EMAIL */

  profileEmail.textContent =
    user.email;

}

loadProfile();

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
   CURSORE CUSTOM
========================= */

const cursor =
  document.querySelector(
    ".cursor"
  );

if(cursor){

  document.addEventListener(
    "mousemove",
    (e) => {

      cursor.style.left =
        e.clientX + "px";

      cursor.style.top =
        e.clientY + "px";

    }
  );

}

/* =========================
   FADE IN
========================= */

window.addEventListener(
  "load",
  () => {

    document.body.classList.add(
      "loaded"
    );

  }
);

/* =========================
   ESCAPE
========================= */

document.addEventListener(
  "keydown",
  (e) => {

    if(
      e.key === "Escape" &&
      document.body.classList.contains(
        "login-page"
      )
    ){

      window.location.href =
        "index.html";

    }

  }
);
