


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

    const cardsToShow =

      window.innerWidth <= 768

        ? 4

        : 3;

    for(
      let i = 0;
      i < cardsToShow;
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
  genreFilter.value
  .toLowerCase();

  const ratingValue =
    ratingFilter.value;

  const rubricaValue =
  rubricaFilter.value
  .toLowerCase();

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
