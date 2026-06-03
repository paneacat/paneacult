const exploreReviews =
  document.getElementById(
    "exploreReviews"
  );

const exploreRatings =
  document.getElementById(
    "exploreRatings"
  );

let allReviews = [];

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

  renderExplore(
    allReviews
  );

}

function renderExplore(
  reviews
){
const reviewsOnly =
  reviews.filter(
    review => review.review_text
  );

const ratingsOnly =
  reviews.filter(
    review => !review.review_text
  );
  
  if(!reviews.length){
let reviewsHtml = "";
let ratingsHtml = "";

    
    exploreFeed.innerHTML = `
      <p class="empty-text">
        Nessuna recensione pubblicata.
      </p>
    `;

    return;

  }

  reviews.forEach(review => {
  if(!review.review_text){

  ratingsHtml += `
  ...
`;
return;

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
  }

  return `

      <article class="review-card">

        <div class="review-poster">

          <img
            src="https://image.tmdb.org/t/p/w500${review.movie_poster}"
            alt="${review.movie_title}"
          >

        </div>

        <div class="review-content">

          <div class="review-header">

            <span class="review-user">
              @${review.username}
            </span>

            <span class="review-rating">
              ${review.rating || "-"} ★
            </span>

          </div>

          <h3 class="review-film">
            ${review.movie_title}
          </h3>

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

exploreReviews.innerHTML =
  reviewsHtml;

exploreRatings.innerHTML =
  ratingsHtml;

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

  filtered =
    filtered.filter(
      review =>
        review.movie_title
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


loadExplore();


