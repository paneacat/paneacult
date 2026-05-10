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

const logoutBtn =
  document.querySelector(
    ".logout-btn"
  );

const saveBtns =
  document.querySelectorAll(
    ".save-movie-btn"
  );

const loginBtn =
  document.querySelector(
    ".login-btn"
  );

const registerBtn =
  document.querySelector(
    ".register-btn"
  );

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
      "login.html";

    return;

  }

  profileEmail.textContent =
    user.email;

}
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
   ESCAPE LOGIN
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

/* =========================
   SAVE MOVIES
========================= */

saveBtns.forEach(btn => {

  btn.addEventListener(
    "click",
    async () => {

    const {
  data: { user }
} =
await supabaseClient.auth.getUser();

if(!user){

  window.location.href =
    "login.html";

  return;

}

      const movie =
        btn.dataset.movie;

      const poster =
        btn.dataset.poster;

      const link =
        btn.dataset.link;

      const type =
        btn.dataset.type;

      const icon =
        btn.dataset.icon;

      /* CHECK DUPLICATI */

      const { data: existing } =
        await supabaseClient
          .from("saved_movies")
          .select("*")
          .eq("user_id", user.id)
          .eq("movie", movie)
          .eq("type", type);

      if(existing.length > 0){

        return;

      }

      /* INSERT */

      const { error } =
        await supabaseClient
          .from("saved_movies")
          .insert([{

            user_id: user.id,

            movie,

            poster,

            link,

            type

          }]);

      if(error){

        console.log(error);

      }

      else {

        /* SAVE */

        if(icon === "save"){

          btn.innerText =
            "★ Salva il film";

        }

        /* FAVORITE */

        if(icon === "favorite"){

          btn.innerText =
            "♥ Lo adoro!";

        }

        /* WATCHED */

        if(icon === "watched"){

          btn.innerText =
            "✓ L'ho visto";

        }

        btn.disabled = true;

        btn.classList.add(
          "saved-state"
        );

      }

    }
  );

});

/* =========================
   LOAD SAVED MOVIES
========================= */

async function loadSavedMovies(){

  const savedGrid =
    document.getElementById(
      "savedGrid"
    );

  const savedEmpty =
    document.getElementById(
      "savedEmpty"
    );

  if(!savedGrid){

    return;

  }

  const {
    data: { user }
  } =
  await supabaseClient.auth.getUser();

  if(!user){

    return;

  }

  const { data, error } =
    await supabaseClient
      .from("saved_movies")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false
      });

  if(error){

    console.log(error);

    return;

  }

  savedGrid.innerHTML = "";

  /* EMPTY STATE */

  if(data.length === 0){

    if(savedEmpty){

      savedEmpty.style.display =
        "block";

    }

    return;

  }

  else {

    if(savedEmpty){

      savedEmpty.style.display =
        "none";

    }

  }

  /* CARD FILM */

  data.forEach(movie => {

    savedGrid.innerHTML += `

      <a
        href="${movie.link}"
        class="saved-card"
      >

        <img
          src="${movie.poster}"
          alt="${movie.movie}"
        >

        <div class="saved-overlay">

          <h3>
            ${movie.movie}
          </h3>

          <button
            class="remove-btn"
            data-id="${movie.id}"
          >

            Rimuovi

          </button>

        </div>

      </a>

    `;

  });

}

loadSavedMovies();

/* =========================
   CHECK SAVED
========================= */

async function checkIfSaved(){

  if(!saveBtns.length){

    return;

  }

  const {
    data: { user }
  } =
  await supabaseClient.auth.getUser();

  if(!user){

    return;

  }

  saveBtns.forEach(async btn => {

    const movie =
      btn.dataset.movie;

    const type =
      btn.dataset.type;

    const icon =
      btn.dataset.icon;

    const { data } =
      await supabaseClient
        .from("saved_movies")
        .select("*")
        .eq("user_id", user.id)
        .eq("movie", movie)
        .eq("type", type);

    if(data.length > 0){

      /* SAVE */

      if(icon === "save"){

        btn.innerText =
          "★ Salva il film";

      }

      /* FAVORITE */

      if(icon === "favorite"){

        btn.innerText =
          "♥ Lo adoro!";

      }

      /* WATCHED */

      if(icon === "watched"){

        btn.innerText =
          "✓ L'ho visto";

      }

      btn.disabled = true;

      btn.classList.add(
        "saved-state"
      );

    }

  });

}

checkIfSaved();

/* =========================
   REMOVE MOVIE
========================= */

document.addEventListener(
  "click",
  async (e) => {

    if(
      e.target.classList.contains(
        "remove-btn"
      )
    ){

      e.preventDefault();

      e.stopPropagation();

      const id =
        e.target.dataset.id;

      await supabaseClient
        .from("saved_movies")
        .delete()
        .eq("id", id);

      loadSavedMovies();

    }

  }
);

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

    }

    else {

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
      "https://paneacat.github.io/paneacult/profilo.html"

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
);
