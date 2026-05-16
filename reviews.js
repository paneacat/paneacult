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

let visibleReviews = 3;

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

    const remaining =
      document.querySelectorAll(
        ".hidden-review"
      );

    if(!remaining.length){

      loadMoreBtn.style.display =
        "none";

    }

  }
);

/* =========================
   EMPTY STATE
========================= */

const reviewsGrid =
  document.querySelector(
    ".reviews-grid"
  );

const reviewCards =
  document.querySelectorAll(
    ".review-card"
  );

if(
  reviewsGrid &&
  reviewCards.length === 0
){

  reviewsGrid.innerHTML = `

    <div class="empty-state">

      <span class="empty-icon">
        ✦
      </span>

      <h3>
        Nessuna recensione trovata
      </h3>

      <div class="suggest-review">

        <p>
          Manca un film che ami?
        </p>

        <a
          href="mailto:paneacult@gmail.com?subject=Consiglio recensione paneacult"
        >

          Suggeriscimi una recensione →

        </a>

      </div>

    </div>

  `;

}
