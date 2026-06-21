


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
        data-director="${review.director}"
        data-rating="${renderStars(review.rating)}"
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

  ${renderStars(review.rating)}

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
    .limit(1)
    .maybeSingle();

  if(error || !data){

    console.log(error);

    reviewContainer.innerHTML =
      "<p>Recensione non trovata.</p>";

    return;

  }

  document.title =
  `${data.movie_title} • paneacult`;

/* =========================
   REVIEW BADGES
========================= */
   
reviewContainer.innerHTML = `

<section
  class="review-hero"
  style="
    background-image:
      url('${data.movie_backdrop}');
    background-size: cover;
    background-position: center;
  "
>

  <div class="review-hero-content">

    <div class="review-info">

      <p class="review-kicker">
        RECENSIONE
      </p>

      <h1 class="review-title">
        ${data.movie_title}
      </h1>

      <div class="review-meta">

     
  ${
    data.year
    ? `
    <span class="meta-pill">
      ${data.year}
    </span>
    `
    : ""
  }

  ${
    data.director
    ? `
    <span class="meta-pill">
      ${data.director}
    </span>
    `
    : ""
  }

</div>

${
  data.subtitle
  ? `
  <p class="review-subtitle">
    ${data.subtitle}
  </p>
  `
  : ""
}
${
  data.watch_link
  ? `
  <div class="where-watch">

    <a
      href="${data.watch_link}"
      target="_blank"
      class="hero-watch-btn"
    >
      ${data.watch_label || "Guarda ora"}
    </a>

  </div>
  `
  : ""
}

    </div>

  </div>

</section>


<section class="review-layout">

  <aside class="review-sidebar">

    <div class="sidebar-box">

${
  data.director
  ? `
<div class="sidebar-item sidebar-regia">

    <p class="sidebar-label">
      Regia
    </p>

    <p class="sidebar-value">
      ${data.director}
    </p>

  </div>
  `
  : ""
}

${
  data.screenplay
  ? `
  <div class="sidebar-item sidebar-screenplay">

    <p class="sidebar-label">
      Sceneggiatura
    </p>

    <p class="sidebar-value">
      ${data.screenplay}
    </p>

  </div>
  `
  : ""
}

${
  data.genre
  ? `
  <div class="sidebar-item sidebar-genre">

    <p class="sidebar-label">
      Genere
    </p>

    <p class="sidebar-value">
      ${data.genre}
    </p>

  </div>
  `
  : ""
}
   
   ${
  data.imdb_rating
  ? `
  <div class="sidebar-item sidebar-imdb">

    <p class="sidebar-label">
      IMDb
    </p>

    <p class="sidebar-value">
      ${data.imdb_rating} /10
    </p>

  </div>
  `
  : ""
   }
${
  data.country
  ? `
  <div class="sidebar-item sidebar-country">

  <p class="sidebar-label">
    Paese
  </p>

  <p class="sidebar-value">
    ${data.country}
  </p>

</div>
  `
  : ""
}

${
  data.runtime
  ? `
  <div class="sidebar-item sidebar-runtime">

    <p class="sidebar-label">
      Durata
    </p>

    <p class="sidebar-value">
      ${data.runtime}
    </p>

  </div>
  `
  : ""
}

${
  data.rubrica
  ? `
  <div class="sidebar-item sidebar-rubrica">

    <p class="sidebar-label">
      Rubrica
    </p>

    <p class="sidebar-value sidebar-series">
      ${data.rubrica}
    </p>

  </div>
  `
  : ""
}
</div>

<div class="movie-actions">

  <a
    href="add-review.html?id=${movieId}"
    class="hero-watch-btn"
  >
    🎬 Apri scheda film
  </a>

</div>

  </aside>

<section class="review-content">

    <div class="review-body">

  ${data.review_text}
</div>

    <div class="rating">

  <span class="rating-stars">
    ${renderStars(data.rating)}
  </span>

  <span class="rating-text">
    ${data.rating}
  </span>

</div>

${
  data.mood
  ? `
  <div class="review-mood">

    <span class="review-mood-label">
      MOOD
    </span>

    <span class="review-mood-value">
      ${data.mood}
    </span>

  </div>
  `
  : ""
}
   

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
<div id="userReviewsSection"></div>
</section>
`;

   const userReviewsSection =
  document.getElementById(
    "userReviewsSection"
  );

const {
  data: userReviews
} =
  await supabaseClient
    .from("user_reviews")
    .select("*")
    .eq(
  "movie_title",
  data.movie_title
)
    .order(
      "created_at",
      {
        ascending:false
      }
    );

if(
  userReviews &&
  userReviews.length
){

  userReviewsSection.innerHTML = `

    <section class="community-section">

      <h2 class="community-title">
        Community
      </h2>

      <div class="community-grid">

        ${
          userReviews.map(
            review => `

            <article
  class="community-card"
>

  <div
    class="community-stars"
  >
    ${
      "★".repeat(
        review.rating
      ) +
      "☆".repeat(
        5-review.rating
      )
    }
  </div>

  <p
    class="community-text"
  >
    ${review.review_text}
  </p>

</article>

          `
          ).join("")
        }

      </div>

    </section>

  `;

}

}


loadSingleReview();
