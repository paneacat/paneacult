async function loadExploreReviews(){

  const grid =
    document.getElementById(
      "exploreGrid"
    );

  if(!grid) return;

  const {
    data,
    error
  } =
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

  if(!data?.length){

    grid.innerHTML = `
      <p class="empty-text">
        Nessuna recensione.
      </p>
    `;

    return;

  }

  grid.innerHTML =

    data.map(review => `

      <article
        class="explore-card"
      >

        <img
          src="${review.movie_poster}"
          alt="${review.movie_title}"
        >

        <div class="explore-content">

          <h3>
            ${review.movie_title}
          </h3>

          <span>
            ★ ${review.rating || "-"}
          </span>

          <p>
            ${review.review_text || ""}
          </p>

          <small>
            ${review.username || "utente"}
          </small>

        </div>

      </article>

    `).join("");

}

loadExploreReviews();
