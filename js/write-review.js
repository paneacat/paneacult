if(
  !reviewText &&
  !reviewRating &&
  !selectedMovie
){

  console.log(
    "Review elements not found"
  );

}


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
   RESTORE SELECTED MOVIE
========================= */

const savedMovie =
  localStorage.getItem(
    "paneacult_selected_movie"
  );

const savedMovieHTML =
  localStorage.getItem(
    "paneacult_selected_movie_html"
  );

if(
  savedMovie &&
  savedMovieHTML &&
  selectedMovie &&
  reviewForm &&
  movieSearchInput
){
  selectedMovieData =
    JSON.parse(savedMovie);

  selectedMovie.innerHTML =
    savedMovieHTML;

  if(reviewForm){

  reviewForm.style.display =
    "block";

     }

  if(movieSearchInput){

  movieSearchInput.value =
    selectedMovieData.title;

  }

}

const publishReviewBtn =
  document.getElementById(
    "publishReviewBtn"
  );

/* =========================
   PUBLISH REVIEW
========================= */

publishReviewBtn?.addEventListener(
  "click",
  async () => {

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

    if(!user){

      window.location.href =
        "login.html";

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
        .replace(/[^\w-]+/g, "");

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

          review_text:
            reviewTextValue,

          rating:
            ratingValue,

          slug,

          user_id:
            user.id

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

    alert(
      "Recensione pubblicata ✨"
    );

  }
);
