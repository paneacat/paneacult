const exploreReviews =
  document.getElementById(
    "exploreReviews"
  );

const exploreRatings =
  document.getElementById(
    "exploreRatings"
  );

let allReviews = [];
let visibleReviews = 10;

async function loadExplore(){

  const { data, error } =
    await supabaseClient
      .from("user_reviews")
      .select("*")
      .order(
        "created_at",
        {
          ascending:false
        }
      );

  if(error){
    console.log(error);
    return;
  }

  allReviews =
    data || [];
populateGenres();
  renderExplore(
    allReviews
  );

}




function renderExplore(reviews){

  if(!reviews.length){

    exploreReviews.innerHTML = `
      <p class="empty-text">
        Nessuna recensione pubblicata.
      </p>
    `;

    exploreRatings.innerHTML = "";

    return;

  }

  const reviewsOnly =
    reviews.filter(
      review => review.review_text
    );

  const ratingsOnly =
    reviews.filter(
      review => !review.review_text
    );

  const visibleReviewsOnly =
    reviewsOnly.slice(
      0,
      visibleReviews
    );

  let reviewsHtml = "";
  let ratingsHtml = "";

  visibleReviewsOnly.forEach(review => {

    reviewsHtml += `

      <article
  class="review-card"
  onclick="goToMovie(${review.movie_id})"
>
        <div class="review-poster">

          <img
            src="https://image.tmdb.org/t/p/w500${review.movie_poster}"
            alt="${review.movie_title}"
          >

        </div>

        <div class="review-content">

          <div class="review-header">

  <div class="review-user-box">

    <img
      class="review-avatar"
      src="${
        review.avatar_url ||
        'img/default-avatar.webp'
      }"
      alt="${review.username}"
    >

    <span class="review-user">
      @${review.username}
    </span>

  </div>

  <span class="review-rating">
    ${review.rating || "-"} ★
  </span>

</div>


          <h3 class="review-film">
  ${review.movie_title}
</h3>

<div class="review-tag">
  RECENSIONE
</div>

<p class="review-text">
  ${review.review_text}
</p>
          <div class="review-date">
            ${new Date(
              review.created_at
            ).toLocaleDateString(
              "it-IT"
            )}
          </div>

        </div>

      </article>

    `;

  });

  ratingsOnly.forEach(review => {

    ratingsHtml += `

      <article class="rating-card">

        <img
          class="rating-card-poster"
          src="https://image.tmdb.org/t/p/w500${review.movie_poster}"
          alt="${review.movie_title}"
        >

        <h3 class="rating-card-title">
          ${review.movie_title}
        </h3>

        <div class="rating-only-stars">
          ${review.rating || "-"} ★
        </div>

        <div class="rating-user">
          @${review.username}
        </div>

        <div class="rating-date">
          ${new Date(
            review.created_at
          ).toLocaleDateString(
            "it-IT"
          )}
        </div>

      </article>

    `;

  });

  exploreReviews.innerHTML =
  reviewsHtml;

exploreRatings.innerHTML =
  ratingsHtml;

const loadMoreBtn =
  document.getElementById(
    "loadMoreBtn"
  );

if(loadMoreBtn){

  loadMoreBtn.style.display =

    reviewsOnly.length >
    visibleReviews

      ? "block"

      : "none";

}
  
}




function filterExplore(){

  let filtered =
    [...allReviews];

  const search =
    document
      .getElementById(
        "exploreSearch"
      )
      ?.value
      .toLowerCase() || "";

  const rating =
    document
      .getElementById(
        "exploreRating"
      )
      ?.value || "all";

  const type =
    document
      .getElementById(
        "exploreType"
      )
      ?.value || "all";

  const order =
    document
      .getElementById(
        "exploreOrder"
      )
      ?.value || "recent";
const genre =
  document
    .getElementById(
      "exploreGenre"
    )
    ?.value || "all";

const year =
  document
    .getElementById(
      "exploreYear"
    )
    ?.value || "all";
  
  filtered =
  filtered.filter(
    review =>

      review.movie_title
        ?.toLowerCase()
        .includes(search)

      ||

      review.username
        ?.toLowerCase()
        .includes(search)

      ||

      review.director
        ?.toLowerCase()
        .includes(search)

      ||

      review.review_text
        ?.toLowerCase()
        .includes(search)
  );

  
  if(rating !== "all"){

    filtered =
      filtered.filter(
        review =>
          String(review.rating)
          === rating
      );

  }

  if(type === "reviews"){

    filtered =
      filtered.filter(
        review =>
          review.review_text
      );

  }

  if(type === "ratings"){

    filtered =
      filtered.filter(
        review =>
          !review.review_text
      );

  }

  if(genre !== "all"){

  filtered =
    filtered.filter(
      review =>
        review.genre?.includes(
          genre
        )
    );

  }

  if(year === "new"){

  filtered =
    filtered.filter(
      review =>
        review.release_year >=
        2020
    );

}

if(year === "modern"){

  filtered =
    filtered.filter(
      review =>
        review.release_year >=
        2000 &&
        review.release_year < 2020
    );

}

if(year === "classic"){

  filtered =
    filtered.filter(
      review =>
        review.release_year <
        2000
    );

}
  
  if(order === "highest"){

    filtered.sort(
      (a,b) =>
        (b.rating || 0) -
        (a.rating || 0)
    );

  }

  if(order === "lowest"){

    filtered.sort(
      (a,b) =>
        (a.rating || 0) -
        (b.rating || 0)
    );

  }

  if(order === "old"){

    filtered.reverse();

  }
  
if(order === "recent"){

  filtered.sort(
    (a,b) =>
      new Date(b.created_at) -
      new Date(a.created_at)
  );

}
  renderExplore(
    filtered
  );

}

document
  .getElementById(
    "exploreSearch"
  )
  ?.addEventListener(
    "input",
    filterExplore
  );

document
  .getElementById(
    "exploreRating"
  )
  ?.addEventListener(
    "change",
    filterExplore
  );

document
  .getElementById(
    "exploreType"
  )
  ?.addEventListener(
    "change",
    filterExplore
  );

document
  .getElementById(
    "exploreOrder"
  )
  ?.addEventListener(
    "change",
    filterExplore
  );


document
  .getElementById(
    "exploreGenre"
  )
  ?.addEventListener(
    "change",
    filterExplore
  );

document
  .getElementById(
    "exploreYear"
  )
  ?.addEventListener(
    "change",
    filterExplore
  );

  document
  .getElementById("loadMoreBtn")
  ?.addEventListener(
    "click",
    () => {

      visibleReviews += 10;

      renderExplore(
        allReviews
      );

    }
  );
function populateGenres(){

  const genres =
    [...new Set(

      allReviews.flatMap(
        review =>
          review.genre
            ? review.genre.split(", ")
            : []
      )

    )].sort();

  const select =
    document.getElementById(
      "exploreGenre"
    );

  if(!select) return;

  select.innerHTML =
    `
      <option value="all">
        Tutti i generi
      </option>
    `;

  genres.forEach(genre => {

    select.innerHTML += `
      <option value="${genre}">
        ${genre}
      </option>
    `;

  });

}
loadExplore();

function goToMovie(id){

  if(!id) return;

  window.location.href =
    `add-review.html?id=${id}`;

}
