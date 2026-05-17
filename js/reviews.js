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

hiddenReviews[i].classList.remove(
  "hidden"
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

const genreFilter =
  document.getElementById(
    "genreFilter"
  );

const ratingFilter =
  document.getElementById(
    "ratingFilter"
  );

const rubricaFilter =
  document.getElementById(
    "rubricaFilter"
  );

const resetFilters =
  document.getElementById(
    "resetFilters"
  );

function filterReviews(){

  const value =
    searchInput.value
    .toLowerCase()
    .trim();

  const genreValue =
    genreFilter.value;

  const ratingValue =
    ratingFilter.value;

  const rubricaValue =
    rubricaFilter.value;

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

    const genre =
      card.dataset.genre || "";

    const rating =
      card.dataset.rating || "";

    const rubrica =
      card.dataset.rubrica || "";

    const matchesSearch =

      title.includes(value) ||

      director.includes(value) ||

      year.includes(value);

    const matchesGenre =

      !genreValue ||

      genre.includes(genreValue);

    const matchesRating =

      !ratingValue ||

      rating === ratingValue;

    const matchesRubrica =

      !rubricaValue ||

      rubrica === rubricaValue;

    if(
      matchesSearch &&
      matchesGenre &&
      matchesRating &&
      matchesRubrica
    ){

      card.classList.remove(
        "hidden"
      );

      visibleCount++;

    }else{

      card.classList.add(
        "hidden"
      );

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

searchInput?.addEventListener(
  "input",
  filterReviews
);

genreFilter?.addEventListener(
  "change",
  filterReviews
);

ratingFilter?.addEventListener(
  "change",
  filterReviews
);

rubricaFilter?.addEventListener(
  "change",
  filterReviews
);

resetFilters?.addEventListener(
  "click",
  () => {

    searchInput.value = "";

    genreFilter.value = "";

    ratingFilter.value = "";

    rubricaFilter.value = "";

    filterReviews();

  }
);



/* =========================
   ELEMENTS
========================= */

const searchInput =
  document.getElementById(
    "searchInput"
  );

const genreFilter =
  document.getElementById(
    "genreFilter"
  );

const ratingFilter =
  document.getElementById(
    "ratingFilter"
  );

const rubricaFilter =
  document.getElementById(
    "rubricaFilter"
  );

const resetFilters =
  document.getElementById(
    "resetFilters"
  );

const reviewCards =
  document.querySelectorAll(
    ".review-card"
  );

const emptyState =
  document.getElementById(
    "emptyState"
  );


/* =========================
   FILTER FUNCTION
========================= */

function filterReviews(){

  const searchValue =
    searchInput.value
      .toLowerCase()
      .trim();

  const genreValue =
    genreFilter.value
      .toLowerCase();

  const ratingValue =
    ratingFilter.value;

  const rubricaValue =
    rubricaFilter.value;

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

    const genre =
      card.dataset.genre
        ?.toLowerCase() || "";

    const rating =
      card.dataset.rating || "";

    const rubrica =
      card.dataset.rubrica || "";

    const matchesSearch =

      title.includes(searchValue) ||

      director.includes(searchValue) ||

      year.includes(searchValue);

    const matchesGenre =

      !genreValue ||

      genre.includes(genreValue);

    const matchesRating =

      !ratingValue ||

      rating === ratingValue;

    const matchesRubrica =

      !rubricaValue ||

      rubrica === rubricaValue;

    if(
      matchesSearch &&
      matchesGenre &&
      matchesRating &&
      matchesRubrica
    ){

      card.style.display = "";
      visibleCount++;

    }else{

      card.style.display = "none";

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


/* =========================
   EVENTS
========================= */

searchInput?.addEventListener(
  "input",
  filterReviews
);

genreFilter?.addEventListener(
  "change",
  filterReviews
);

ratingFilter?.addEventListener(
  "change",
  filterReviews
);

rubricaFilter?.addEventListener(
  "change",
  filterReviews
);


/* =========================
   RESET FILTERS
========================= */

resetFilters?.addEventListener(
  "click",
  () => {

    searchInput.value = "";

    genreFilter.value = "";

    ratingFilter.value = "";

    rubricaFilter.value = "";

    filterReviews();

  }
);
