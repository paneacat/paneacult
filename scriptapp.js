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

/* =========================
   CHECK SESSIONE
========================= */

async function checkSession(){

  const {
    data: { session }
  } =
  await supabaseClient.auth.getSession();

  /* UTENTE LOGGATO */

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

  /* UTENTE NON LOGGATO */

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
   CURSORE CUSTOM
========================= */

const cursor =
  document.querySelector(".cursor");

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
   PARALLAX LEGGERO
========================= */

const welcomePage =
  document.querySelector(
    ".welcome-page"
  );

if(welcomePage){

  document.addEventListener(
    "mousemove",
    (e) => {

      const x =
        (window.innerWidth / 2 - e.clientX)
        / 90;

      const y =
        (window.innerHeight / 2 - e.clientY)
        / 90;

      welcomePage.style.backgroundPosition =
        `${50 + x}% ${50 + y}%`;

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
   ESCAPE LOGIN
========================= */

document.addEventListener(
  "keydown",
  (e) => {

    if(e.key === "Escape"){

      window.location.href =
        "index.html";

    }

  }
);
