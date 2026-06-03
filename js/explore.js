const exploreFeed =
  document.getElementById(
    "exploreFeed"
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

  if(!reviews.length){

    exploreFeed.innerHTML = `
      <p class="empty-text">
        Nessuna recensione pubblicata.
      </p>
    `;

    return;

  }

  exploreFeed.innerHTML =

reviews.map(review => {

  if(!review.review_text){

    return `
    
      <article class="rating-card">

        <img
          src="https://image.tmdb.org/t/p/w500${review.movie_poster}"
          alt="${review.movie_title}"
        >

        <h3>${review.movie_title}</h3>

        <div class="rating-only-stars">
          ${review.rating} ★
        </div>

        <div class="rating-user">
          @${review.username}
        </div>

        <div class="rating-date">
          ${new Date(review.created_at)
            .toLocaleDateString("it-IT")}
        </div>

      </article>
    `;

  }

  return `
  
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
}).join("");

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


