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

loadMoreBtn?.addEventListener(
  "click",
  () => {

    const hiddenReviews =
      document.querySelectorAll(
        ".hidden-review"
      );

    for(
      let i = 0;
      i < 3;
      i++
    ){

      if(hiddenReviews[i]){

        hiddenReviews[i].classList.remove(
          "hidden-review"
        );

      }

    }

    if(
      document.querySelectorAll(
        ".hidden-review"
      ).length === 0
    ){

      loadMoreBtn.style.display =
        "none";

    }

  }
);

/* =========================
   EMPTY STATE
========================= */

const emptyState =
  document.getElementById(
    "emptyState"
  );

function updateEmptyState(){

  const visibleCards =
    document.querySelectorAll(
      ".review-card:not(.hidden)"
    );

  if(visibleCards.length === 0){

    emptyState.style.display =
      "block";

  }else{

    emptyState.style.display =
      "none";

  }

}


/* =========================
   LIVE SEARCH
========================= */

const searchInput =
  document.getElementById(
    "searchInput"
  );

const reviewCards =
  document.querySelectorAll(
    ".review-card"
  );

const emptyState =
  document.getElementById(
    "emptyState"
  );

searchInput?.addEventListener(
  "input",
  () => {

    const value =
      searchInput.value
      .toLowerCase()
      .trim();

    let visibleCount = 0;

    reviewCards.forEach(card => {

      const title =
        card.dataset.title
        ?.toLowerCase() || "";

      const director =
        card.dataset.director
        ?.toLowerCase() || "";

      const year =
        card.dataset.year
        ?.toLowerCase() || "";

      const matches =

        title.includes(value) ||

        director.includes(value) ||

        year.includes(value);

      if(matches){

        card.style.display =
          "";

        visibleCount++;

      }else{

        card.style.display =
          "none";

      }

    });

    /* EMPTY STATE */

    if(emptyState){

      if(visibleCount === 0){

        emptyState.style.display =
          "block";

      }else{

        emptyState.style.display =
          "none";

      }

    }

  }
);
