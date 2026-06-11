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

      /* CHECK */

      const { data: existing } =
        await supabaseClient
          .from("saved_movies")
          .select("*")
          .eq("user_id", user.id)
          .eq("movie", movie)
          .eq("type", type);

      /* REMOVE */

      if(existing.length > 0){

        await supabaseClient
          .from("saved_movies")
          .delete()
          .eq("id", existing[0].id);

        btn.classList.remove(
          "saved-state"
        );

        /* RESET TESTO */

        if(icon === "save"){
          btn.innerText =
            "☆ Salva il film";
        }

        if(icon === "favorite"){
          btn.innerText =
            "♡ Lo adoro!";
        }

        if(icon === "watched"){
          btn.innerText =
            "✓ L'ho visto";
        }

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

        return;

      }

      /* ATTIVO */

      btn.classList.add(
        "saved-state"
      );

      if(icon === "save"){
        btn.innerText =
          "★ Salva il film";
      }

      if(icon === "favorite"){
        btn.innerText =
          "♥ Lo adoro!";
      }

      if(icon === "watched"){
        btn.innerText =
          "✓ Visto";
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

  const watchedGrid =
    document.getElementById(
      "watchedGrid"
    );

  const favoriteGrid =
    document.getElementById(
      "favoriteGrid"
    );

  if(
    !savedGrid ||
    !watchedGrid ||
    !favoriteGrid
  ){

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

  /* RESET */

  savedGrid.innerHTML = "";

  watchedGrid.innerHTML = "";

  favoriteGrid.innerHTML = "";

  /* EMPTY */

  if(data.length === 0){

    savedGrid.innerHTML = `
      <p class="empty-grid">
        Nessun film salvato.
      </p>
    `;

    watchedGrid.innerHTML = `
      <p class="empty-grid">
        Nessun film visto.
      </p>
    `;

    favoriteGrid.innerHTML = `
      <p class="empty-grid">
        Nessun preferito.
      </p>
    `;

    return;

  }

  /* CARD FILM */

  data.forEach(movie => {

    const card = `

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

    /* SAVED */

    if(movie.type === "saved"){

      savedGrid.innerHTML += card;

    }

    /* WATCHED */

    if(movie.type === "watched"){

      watchedGrid.innerHTML += card;

    }

    /* FAVORITE */

    if(movie.type === "favorite"){

      favoriteGrid.innerHTML += card;

    }

  });

}

loadSavedMovies().then(() => {
  limitMobileCards();
});
  
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

      loadSavedMovies().then(() => {
  limitMobileCards();
});

    }

  }
);



function limitMobileCards(){

  if(window.innerWidth > 768){
    return;
  }

  const sections = [
    "savedGrid",
    "watchedGrid",
    "favoriteGrid"
  ];

  sections.forEach(id => {

    const grid =
      document.getElementById(id);

    if(!grid) return;

    const cards =
      grid.querySelectorAll(
        ".saved-card"
      );

    cards.forEach((card,index) => {

      if(index >= 4){

        card.style.display =
          "none";

      }

    });

    if(cards.length > 4){

      const btn =
        document.createElement(
          "button"
        );

      btn.innerText =
        "Mostra altri";

      btn.className =
        "load-more-btn";

      btn.onclick = () => {

        cards.forEach(card => {

          card.style.display =
            "";

        });

        btn.remove();

      };

      grid.after(btn);

    }

  });

}
