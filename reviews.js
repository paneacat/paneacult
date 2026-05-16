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
  selectedMovie
){

  selectedMovieData =
    JSON.parse(savedMovie);

  selectedMovie.innerHTML =
    savedMovieHTML;

  reviewForm.style.display =
    "block";

  movieSearchInput.value =
    selectedMovieData.title;

}



const publishReviewBtn =
  document.getElementById(
    "publishReviewBtn"
  );


/* =========================
   LOAD MORE REVIEWS
========================= */

const loadMoreBtn =
  document.getElementById(
    "loadMoreBtn"
  );

const hiddenReviews =
  document.querySelectorAll(
    ".hidden-review"
  );

let visibleReviews = 0;

loadMoreBtn?.addEventListener(
  "click",
  () => {

    for(
      let i = visibleReviews;
      i < visibleReviews + 3;
      i++
    ){

      if(hiddenReviews[i]){

        hiddenReviews[i].classList.remove(
          "hidden-review"
        );

      }

    }

    visibleReviews += 3;

    if(
      visibleReviews >=
      hiddenReviews.length
    ){

      loadMoreBtn.style.display =
        "none";

    }

  }
);
