
const exploreFeed =
  document.getElementById(
    "exploreFeed"
  );

async function loadExplore(){

  const { data, error } =
    await supabaseClient
      .from("user_reviews")
      .select("*")
      .order(
        "created_at",
        { ascending:false }
      );

  if(error){

  console.log(error);
  return;

}

console.log(
  "RECENSIONI:",
  data
);

  renderExplore(data || []);

}

loadExplore();


function renderExplore(reviews){

  if(!exploreFeed) return;

  if(!reviews.length){

    exploreFeed.innerHTML = `
      <p class="empty-text">
        Nessuna recensione pubblicata.
      </p>
    `;

    return;

  }

  exploreFeed.innerHTML =

    reviews.map(review => `

      <article class="review-card">

        <div class="review-header">

          <span class="review-user">
            @${review.username}
          </span>

          <span class="review-rating">
            ${review.rating || "-"} ★
          </span>

        </div>

        <h3>
          ${review.movie_title}
        </h3>

        <p>
          ${
            review.review_text ||
            "Ha lasciato solo una valutazione."
          }
        </p>

      </article>

    `).join("");

}



const exploreFeed =
  document.getElementById(
    "exploreFeed"
  );

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

  renderExplore(
    data || []
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

    reviews.map(review => `

      <article
        class="review-card"
      >

        <div class="review-poster">

          <img
            src="https://image.tmdb.org/t/p/w500${review.movie_poster}"
            alt="${review.movie_title}"
          >

        </div>

        <div class="review-content">

          <div class="review-header">

            <span
              class="review-user"
            >
              @${review.username}
            </span>

            <span
              class="review-rating"
            >
              ${review.rating || "-"} ★
            </span>

          </div>

          <h3
            class="review-film"
          >
            ${review.movie_title}
          </h3>

          <p
            class="review-text"
          >
            ${
              review.review_text ||
              "Ha lasciato solo una valutazione."
            }
          </p>

          <div
            class="review-date"
          >
            ${new Date(
              review.created_at
            ).toLocaleDateString(
              "it-IT"
            )}
          </div>

        </div>

      </article>

    `).join("");

}

loadExplore();


