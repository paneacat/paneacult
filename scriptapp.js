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

const saveBtn =
  document.querySelector(
    ".save-movie-btn"
  );

/* =========================
   CHECK SESSIONE
========================= */

async function checkSession(){

  const {
    data: { session }
  } =
  await supabaseClient.auth.getSession();

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
   SAVE MOVIE
========================= */

saveBtn?.addEventListener(
  "click",
  async () => {

    const {
      data: { user }
    } =
    await supabaseClient.auth.getUser();

    if(!user){

      alert(
        "Devi effettuare il login"
      );

      return;

    }

    const movie =
      saveBtn.dataset.movie;

    const poster =
      saveBtn.dataset.poster;

    /* CHECK DUPLICATI */

    const { data: existing } =
      await supabaseClient
      .from("saved_movies")
      .select("*")
      .eq("user_id", user.id)
      .eq("movie", movie);

    if(existing.length > 0){

      alert(
        "Film già salvato ✨"
      );

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

        link:
  saveBtn.dataset.link
      }]);

    if(error){

      console.log(error);

      alert(
        "Errore salvataggio"
      );

    }

    else {

      alert(
        "Film salvato ✨"
      );

    }

  }
);

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

      </div>
    `;

  });

}

loadSavedMovies();

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
