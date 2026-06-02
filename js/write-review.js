

/* =========================
   AUTOSAVE REVIEW
========================= */

const reviewText =
  document.getElementById(
    "reviewText"
  );

const reviewRating =
  document.getElementById(
    "reviewRating"
  );

const reviewQuote =
  document.getElementById(
    "reviewQuote"
  );

const reviewCuriosita =
  document.getElementById(
    "reviewCuriosita"
  );

const autosaveStatus =
  document.getElementById(
    "autosaveStatus"
  );

/* LOAD SAVED */

if(reviewText){

  const savedReview =
    localStorage.getItem(
      "paneacult_review_text"
    );

  if(savedReview){

    reviewText.value =
      savedReview;

  }

}

if(reviewRating){

  const savedRating =
    localStorage.getItem(
      "paneacult_review_rating"
    );

  if(savedRating){

    reviewRating.value =
      savedRating;

  }

}

/* SAVE TEXT */

reviewText?.addEventListener(
  "input",
  () => {

    localStorage.setItem(
      "paneacult_review_text",
      reviewText.value
    );

    if(autosaveStatus){

      autosaveStatus.textContent =
        "Bozza salvata";

      autosaveStatus.style.opacity =
        ".9";

      clearTimeout(
        window.autosaveTimeout
      );

      window.autosaveTimeout =
        setTimeout(() => {

          autosaveStatus.textContent =
            "Bozza salvata automaticamente";

          autosaveStatus.style.opacity =
            ".55";

        }, 1500);

    }

  }
);

/* SAVE RATING */

reviewRating?.addEventListener(
  "change",
  () => {

    localStorage.setItem(
      "paneacult_review_rating",
      reviewRating.value
    );

  }
);

/* =========================
   LOAD MOVIE FROM URL
========================= */

const params =
  new URLSearchParams(
    window.location.search
  );

const movieId =
  params.get("id");

if(movieId){

  fetchMovieDetails(
    movieId
  ).then(movieDetails => {

    selectedMovieData =
      movieDetails;

    renderSelectedMovie(
      movieDetails,
      movieDetails
    );

    setupMovieButtons();

    if(movieSearchInput){

      movieSearchInput.value =
        movieDetails.title;

    }

    if(reviewForm){

      reviewForm.style.display =
        "block";

      reviewForm.classList.add(
        "hidden-review-form"
      );

    }

  });

}


const publishReviewBtn =
  document.getElementById(
    "publishReviewBtn"
  );

const publishEditorialBtn =
  document.getElementById(
    "publishEditorialBtn"
  );

/* =========================
   ADMIN CHECK
========================= */

async function checkEditorialAccess(){

  const {
    data:{ user }
  } =
  await supabaseClient.auth
    .getUser();

  if(
    user &&
    user.email ===
    "patrizia.catania22@yahoo.it" &&
    publishEditorialBtn
  ){

    publishEditorialBtn.style.display =
      "inline-flex";

  }

}

checkEditorialAccess();

/* =========================
   PUBLISH REVIEW
========================= */

publishReviewBtn?.addEventListener(
  "click",
  async () => {
saveMovieStatus(
  "watched"
);
   
    if(!selectedMovieData){

      alert(
        "Seleziona un film."
      );

      return;

    }

    const {
      data: { user }
    } =
    await supabaseClient.auth.getUser();

    const username =

  user.email
    ?.split("@")[0]

  ||

  "cinefilo";
     
     if(!user){

      window.location.href =
        "login.html";

      return;

    }

const reviewTextValue =
  reviewText.value;

const rating =
  reviewRating?.value || "";

if(
  !rating &&
  !reviewTextValue.trim()
){

  alert(
    "Aggiungi almeno un voto o una recensione"
  );

  return;
}

const slug =
  selectedMovieData.title
    .toLowerCase()
    .replaceAll(" ","-")
    .replace(/[^\w-]+/g,"");

const { error } =
  await supabaseClient
    .from("user_reviews")
    .upsert([{

      user_id:
        user.id,

      movie_id:
        selectedMovieData.id,

      movie_title:
        selectedMovieData.title,

      movie_poster:
        selectedMovieData.poster_path,

      rating:
        rating || null,

      review_text:
        reviewTextValue.trim() || null,

      username:
        username,

      slug:
        slug

    }]);

    if(error){

      console.log(error);

      alert(
        "Errore pubblicazione"
      );

      return;

    }

    localStorage.removeItem(
      "paneacult_review_text"
    );

    localStorage.removeItem(
      "paneacult_review_rating"
    );
/* RESET DRAFT */

localStorage.removeItem(
  "paneacult_review_text"
);

localStorage.removeItem(
  "paneacult_review_rating"
);

localStorage.removeItem(
  "paneacult_selected_movie"
);


/* RESET UI */

if(reviewText){
  reviewText.value = "";
}

if(reviewRating){
  reviewRating.selectedIndex = 0;
}

if(reviewQuote){
  reviewQuote.value = "";
}

if(reviewCuriosita){
  reviewCuriosita.value = "";
}

if(selectedMovie){
  selectedMovie.innerHTML = "";
}

if(movieSearchInput){
  movieSearchInput.value = "";
}

if(reviewForm){
  reviewForm.style.display = "none";
}

selectedMovieData = null;
     
/* =========================
   PUBLISH EDITORIAL
========================= */

publishEditorialBtn?.addEventListener(
  "click",
  async () => {

    if(!selectedMovieData){

      alert(
        "Seleziona un film."
      );

      return;

    }

    const reviewTextValue =
      reviewText.value.trim();

    const ratingValue =
      parseInt(
        reviewRating.value
      );

    if(!reviewTextValue){

      alert(
        "Scrivi la recensione."
      );

      return;

    }

    const slug =
      selectedMovieData.title
        .toLowerCase()
        .replaceAll(" ", "-")
        .replace(
          /[^\w-]+/g,
          ""
        )
     
    const {
  data:{ user }
} =
await supabaseClient.auth
  .getUser();

const { error } =
  await supabaseClient
    .from("reviews")
    .insert([{

      movie_id:
        selectedMovieData.id,

      movie_title:
        selectedMovieData.title,

      movie_poster:
        `https://image.tmdb.org/t/p/w500${selectedMovieData.poster_path}`,

      movie_backdrop:
        `https://image.tmdb.org/t/p/original${selectedMovieData.backdrop_path}`,

       year:
  selectedMovieData.release_date
    ?.split("-")[0],

director:
  selectedMovieData.director,

genre:
  selectedMovieData.genre_names,

runtime:
  selectedMovieData.runtime,

country:
  selectedMovieData.country,

imdb_rating:
  selectedMovieData.vote_average
    ?.toFixed(1),
   
      review_text:
        reviewTextValue,

      rating:
        ratingValue,

      quote:
        reviewQuote?.value.trim(),

      curiosita:
        reviewCuriosita?.value.trim(),

      slug,

      author_id:
        user?.id,

      is_editorial:
        true

    }]);
          
    if(error){

  console.log(error);

  alert(
    "Errore pubblicazione"
  );

  return;
}

alert(
  "Recensione pubblicata 🎬"
);


     if(
  typeof updateCounters ===
  "function"
){
  updateCounters();
     }


 window.location.href =
  "explore.html";    

  }
);


/* =========================
   AUTO LOAD FROM URL
========================= */

window.addEventListener(
  "DOMContentLoaded",
  async () => {

    const params =
      new URLSearchParams(
        window.location.search
      );

    const movieId =
      params.get("id");

    if(!movieId) return;

    try{

      const movieDetails =
        await fetchMovieDetails(
          movieId
        );

      renderSelectedMovie(
        movieDetails,
        movieDetails
      );

      setupMovieButtons();

    }catch(err){

      console.log(
        "Errore caricamento film",
        err
      );

    }

  }
);
