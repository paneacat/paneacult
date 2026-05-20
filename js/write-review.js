

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
      reviewText.value.trim();

    const ratingValue =
      parseInt(
        reviewRating.value
      );

     const quoteValue =
  reviewQuote?.value.trim();

const curiositaValue =
  reviewCuriosita?.value.trim();
     
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
        .from("user_reviews")
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
  user.id,

username:
  username

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

localStorage.removeItem(
  "paneacult_selected_movie_html"
);

/* RESET UI */

reviewText.value = "";

reviewRating.value = "";

reviewQuote.value = "";
     
reviewCuriosita.value = "";

selectedMovie.innerHTML = "";

movieSearchInput.value = "";

reviewForm.style.display =
  "none";

selectedMovieData = null;
    window.location.href =
  `user-review.html?slug=${slug}`;
  }
);
