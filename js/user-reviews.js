/* =========================
   USER REVIEW PAGE
========================= */

async function loadUserReview(){

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
      .from("user_reviews")
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
    `${data.movie_title} • Community • paneacult`;

  reviewContainer.innerHTML = `

<section class="review-layout">

  <section class="review-content">

    <div class="review-author">

      <img
        src="img/default-user.webp"
        alt="Utente"
      >

      <div>

        <p class="author-name">
          ${data.username || "cinefilo"}
        </p>

      </div>

    </div>

    <h1 class="review-title">
      ${data.movie_title}
    </h1>

    <div class="rating">

      <span class="rating-stars">

        ${renderStars(data.rating)}

      </span>

    </div>

    <div class="review-body">

      ${data.review_text}

    </div>

  </section>

</section>
`;

}

loadUserReview();
