


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


/* =========================
   LOAD REVIEWS FROM SUPABASE
========================= */

async function loadReviews(){

  const reviewsGrid =
    document.getElementById(
      "reviewsGrid"
    );

  if(!reviewsGrid){

    return;

  }

  const { data, error } =
    await supabaseClient
      .from("reviews")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false
        }
      );

  if(error){

    console.log(error);

    return;

  }

  reviewsGrid.innerHTML = "";

  data.forEach(review => {

    reviewsGrid.innerHTML += `

      <article
        class="review-card"
        data-title="${review.movie_title}"
        data-rating="${review.rating}"
      >

        <a
          href="review.html?slug=${review.slug}"
        >

          <img
            src="${review.movie_poster}"
            alt="${review.movie_title}"
            class="archivio-img"
          >

        </a>

        <div class="card-info">

          <h3 class="film-title">

            ${review.movie_title}

          </h3>

          <div class="film-stars">

            ${
              "★".repeat(review.rating) +
              "☆".repeat(
                5 - review.rating
              )
            }

          </div>

        </div>

      </article>

    `;

  });

}

loadReviews();

/* =========================
   DYNAMIC REVIEW PAGE
========================= */

async function loadSingleReview(){

  const reviewContainer =
    document.getElementById(
      "reviewContainer"
    );

  if(!reviewContainer){

    return;

  }

  const params =
    new URLSearchParams(
      window.location.search
    );

  const slug =
    params.get("slug");

  if(!slug){

    reviewContainer.innerHTML =
      "<p>Recensione non trovata.</p>";

    return;

  }

  const { data, error } =
    await supabaseClient
      .from("reviews")
      .select("*")
      .eq("slug", slug)
      .single();

  if(error || !data){

    console.log(error);

    reviewContainer.innerHTML =
      "<p>Recensione non trovata.</p>";

    return;

  }

  document.title =
    `${data.movie_title} • paneacult`;

  reviewContainer.innerHTML = `

<section class="review-hero">

  <div class="review-hero-content">

    <div class="review-scene">

      <img
        src="${data.movie_poster}"
        alt="${data.movie_title}"
      >

    </div>

    <div class="review-info">

      <p class="review-kicker">
        RECENSIONE
      </p>

      <h1 class="review-title">
        ${data.movie_title}
      </h1>

      <div class="review-meta">

        <span>
          ${data.rating}/5
        </span>

      </div>

    </div>

  </div>

</section>

<section class="review-layout">

  <aside class="review-sidebar">

    <div class="sidebar-box">

      <p class="sidebar-label">
        Voto
      </p>

      <p class="sidebar-value sidebar-rating">

        ${
          "★".repeat(data.rating) +
          "☆".repeat(5-data.rating)
        }

      </p>

      <p class="sidebar-label">
        Rubrica
      </p>

      <p class="sidebar-value sidebar-series">
        ${data.rubrica || "-"}
      </p>

    </div>

  </aside>

  <section class="review-content">

    <p>
      ${data.review_text}
    </p>

    <div class="rating">

      <span class="rating-stars">

        ${
          "★".repeat(data.rating) +
          "☆".repeat(5-data.rating)
        }

      </span>

      <span class="rating-text">
        — ${data.rating}/5
      </span>

    </div>

    ${
      data.quote
      ? `
      <blockquote>
        ${data.quote}
      </blockquote>
      `
      : ""
    }

    ${
      data.curiosita
      ? `
      <div class="review-extra">

        <h3>
          CURIOSITÀ
        </h3>

        <p>
          ${data.curiosita}
        </p>

      </div>
      `
      : ""
    }

    <div class="review-author">

      <img
        src="img/patrizia.webp"
        alt="Patrizia"
      >

      <div>

        <p class="author-name">
          Patrizia Catania
        </p>

      </div>

    </div>

  </section>

</section>
`;

}

loadSingleReview();

