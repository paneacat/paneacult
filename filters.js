  
    
/* =========================
   SEARCH + FILTRI
========================= */

const searchInput =
  document.getElementById(
    "searchInput"
  );

if(searchInput){

  const archivioCards =
    document.querySelectorAll(
      ".archivio-card"
    );

  const genreFilter =
    document.getElementById(
      "genreFilter"
    );

  const rubricaFilter =
    document.getElementById(
      "rubricaFilter"
    );

  const ratingFilter =
    document.getElementById(
      "ratingFilter"
    );

  const resetBtn =
    document.getElementById(
      "resetFilters"
    );

  const emptyState =
    document.getElementById(
      "emptyState"
    );

  const loadMoreBtn =
    document.getElementById(
      "loadMoreBtn"
    );

  let visibleCards = 3;

  let timeout;

  function filterCards(){

    const search =
      searchInput.value.toLowerCase();

    const genre =
      genreFilter
        ? genreFilter.value.toLowerCase()
        : "";

    const rubrica =
      rubricaFilter
        ? rubricaFilter.value.toLowerCase()
        : "";

    const rating =
      ratingFilter
        ? ratingFilter.value
        : "";

    let visibleCount = 0;

    archivioCards.forEach(card => {

      const text =
        card.textContent.toLowerCase();

      const cardGenre =
        card.dataset.genre || "";

      const cardRating =
        card.dataset.rating || "";

      const cardRubrica =
        card.dataset.rubrica || "";

      const matchesSearch =
        text.includes(search);

      const matchesGenre =

        !genre ||

        cardGenre
          .split(" ")
          .includes(genre);

      const matchesRubrica =

        !rubrica ||

        cardRubrica === rubrica;

      const matchesRating =

        !rating ||

        cardRating === rating;

      if(
        matchesSearch &&
        matchesGenre &&
        matchesRubrica &&
        matchesRating
      ){

        visibleCount++;

        if(visibleCount <= visibleCards){

          card.style.display =
            "block";

          card.style.opacity =
            "1";

        }

        else {

          card.style.display =
            "none";

        }

      }

      else {

        card.style.display =
          "none";

      }

    });

    if(emptyState){

      emptyState.style.display =

        visibleCount === 0
          ? "flex"
          : "none";

    }

    if(loadMoreBtn){

      loadMoreBtn.style.display =

        visibleCount > visibleCards
          ? "flex"
          : "none";

    }

  }

  searchInput.addEventListener(
    "input",
    () => {

      clearTimeout(timeout);

      timeout = setTimeout(() => {

        visibleCards = 3;

        filterCards();

      }, 220);

    }
  );

  genreFilter?.addEventListener(
    "change",
    () => {

      visibleCards = 3;

      filterCards();

    }
  );

  rubricaFilter?.addEventListener(
    "change",
    () => {

      visibleCards = 3;

      filterCards();

    }
  );

  ratingFilter?.addEventListener(
    "change",
    () => {

      visibleCards = 3;

      filterCards();

    }
  );

  resetBtn?.addEventListener(
    "click",
    () => {

      searchInput.value = "";

      if(genreFilter){
        genreFilter.value = "";
      }

      if(ratingFilter){
        ratingFilter.value = "";
      }

      if(rubricaFilter){
        rubricaFilter.value = "";
      }

      visibleCards = 3;

      filterCards();

    }
  );

  loadMoreBtn?.addEventListener(
    "click",
    () => {

      visibleCards += 3;

      filterCards();

    }
  );

  filterCards();

}
