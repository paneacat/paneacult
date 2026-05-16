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
