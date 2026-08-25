/*==========================
   PROFILE MOVIES
========================= */

const watchedGrid =
  document.getElementById(
    "watchedGrid"
  );

const watchlistGrid =
  document.getElementById(
    "watchlistGrid"
  );

const favoriteGrid =
  document.getElementById(
    "favoriteGrid"
  );

const currentFavorite =
  document.getElementById(
    "currentFavorite"
  );

const signatureGrid =
  document.getElementById(
    "signatureGrid"
  );

const activityFeed =
  document.getElementById(
    "activityFeed"
  );

const tvWatchedGrid =
  document.getElementById(
    "tvWatchedGrid"
  );

const tvWatchlistGrid =
  document.getElementById(
    "tvWatchlistGrid"
  );

const tvFavoriteGrid =
  document.getElementById(
    "tvFavoriteGrid"
  );

/* =========================
   LOAD MOVIES
========================= */

let watched = [];

let watchlist = [];

let favorites = [];

let tvWatched = [];

let tvWatchlist = [];

let tvFavorites = [];




async function loadLibrary(
  mediaType,
  status
){

  const {
    data:{ user }
  } =
  await supabaseClient.auth.getUser();

  if(!user)
    return [];

  const { data } =
    await supabaseClient
      .from("user_movies")
      .select("*")
      .eq("user_id", user.id)
      .eq("media_type", mediaType)
      .eq("status", status);

  return data || [];

}


async function loadWatchlist(){

  watchlist =
    await loadLibrary(
      "movie",
      "watchlist"
    );

  populateWatchlistFilters();

  renderGrid(
    watchlistGrid,
    watchlist
  );

  filterWatchlist();

}

async function loadTvWatchlist(){

  tvWatchlist =
    await loadLibrary(
      "tv",
      "watchlist"
    );

  renderGrid(
    tvWatchlistGrid,
    tvWatchlist
  );

}

async function loadWatched(){

  watched =
    await loadLibrary(
      "movie",
      "watched"
    );

  populateWatchedFilters();

  renderGrid(
    watchedGrid,
    watched
  );

  filterWatched();

}

async function loadTvWatched(){

  tvWatched =
    await loadLibrary(
      "tv",
      "watched"
    );

  renderGrid(
    tvWatchedGrid,
    tvWatched
  );

}


async function loadFavorites(){

  favorites =
    await loadLibrary(
      "movie",
      "favorite"
    );

  populateFavoriteFilters();

  renderGrid(
    favoriteGrid,
    favorites
  );

  filterFavorites();

}

async function loadTvFavorites(){

  tvFavorites =
    await loadLibrary(
      "tv",
      "favorite"
    );

  renderGrid(
    tvFavoriteGrid,
    tvFavorites
  );

}

/* =========================
   LETTERBOXD IMPORT
========================= */

const importBtn =
  document.getElementById("importLetterboxdBtn");

const importInput =
  document.getElementById("letterboxdImport");

if(importInput){
  importInput.multiple = true;
}

importBtn?.addEventListener(
  "click",
  () => {

    importInput.click();

  }
);

importInput?.addEventListener(
  "change",
  async e => {

    const files =
      [...e.target.files];
     
importBtn.disabled = true;

importBtn.textContent =
  "Importazione...";

     const progress =
  document.createElement("div");

progress.style.cssText = `
margin-top:16px;
padding:16px;
background:#17384a;
color:#fff;
border-radius:12px;
font-weight:600;
text-align:center;
line-height:1.8;
`;

importBtn.after(progress);

     
     const firstFile = files[0];

if (
  firstFile &&
  firstFile.name
    .toLowerCase()
    .endsWith(".zip")
) {

  tvTimeInput.files =
    importInput.files;

  tvTimeInput.dispatchEvent(
    new Event("change")
  );

  return;

}

     
    if(!files.length){

      alert(
        "Nessun file selezionato"
      );

      return;

    }

    const {
      data:{ user }
    } =
    await supabaseClient.auth
      .getUser();

    if(!user){

      alert(
        "Login richiesto"
      );

      return;

    }

    let imported = 0;

progress.innerHTML = `
<div style="margin-bottom:10px">
Importazione Letterboxd...
</div>

<progress
value="0"
max="100"
style="width:100%;height:18px">
</progress>

<div style="margin-top:10px">
0 film importati
</div>
`;
     
    for(
      const file of files
    ){

      const text =
        await file.text();

      const rows =
        text
          .split("\n")
          .slice(1);

      const filename =
        file.name.toLowerCase();

      for(
        const row of rows
      ){

        const cols =
          row.split(",");

        const title =
          cols[1]
            ?.replaceAll('"',"")
            ?.trim();

        if(!title)
          continue;

        try{

          const results =
  await searchMovieSmart(title);

          const movie =
            results?.[0];

          if(!movie)
            continue;

           const details =
await fetchMovieDetails(
  movie.id,
movie.media_type || "movie"
);

const director =
details?.credits?.crew?.find(
  person =>
    person.job === "Director"
)?.name || null;
           

          /* WATCHED */

          if (
  filename.includes("watched") ||
  filename.includes("diary")
)
          {

            await supabaseClient
              .from("user_movies")
              .upsert({

                user_id:
                  user.id,

                movie_id:
                  movie.id,
title:
  movie.title || movie.name,

                poster_path:
                  movie.poster_path,
media_type:
  movie.media_type || "movie",
                 
               genre: null,

release_year:
  (movie.release_date || movie.first_air_date)
    ? Number(
        (movie.release_date || movie.first_air_date).slice(0,4)
      )
    : null,
                 director:
director,
                  
                status:
                  "watched"

              });

          }

          /* WATCHLIST */

          if(
            filename.includes(
              "watchlist"
            )
          ){

            await supabaseClient
              .from("user_movies")
              .upsert({

                user_id:
                  user.id,

                movie_id:
                  movie.id,

                title:
  movie.title || movie.name,

                poster_path:
                  movie.poster_path,
media_type:
  movie.media_type || "movie",
                 
                 genre: null,

release_year:
  (movie.release_date || movie.first_air_date)
    ? Number(
        (movie.release_date || movie.first_air_date).slice(0,4)
      )
    : null,

                 director:
                    director,
                 
                 
                status:
                  "watchlist"

              });

          }

          /* RATINGS */

          if(
            filename.includes(
              "ratings"
            )
          ){

            const rating =
              cols[4]
                ?.replaceAll(
                  '"',
                  ""
                )
                ?.trim();

            await supabaseClient
              .from("user_reviews")
              .upsert({

                user_id:
                  user.id,

                movie_id:
                  movie.id,

                title:
  movie.title || movie.name,

                 
                movie_poster:
                  movie.poster_path,
media_type:
  movie.media_type || "movie",
                 
            release_year:
  (movie.release_date || movie.first_air_date)
    ? Number(
        (movie.release_date || movie.first_air_date).slice(0,4)
      )
    : null,
                 
                rating:
                  rating
                    ? parseFloat(
                        rating
                      )
                    : null,

                username:
  localStorage.getItem(
    "paneacult_username"
  ) ||
  profileUsername?.textContent ||
  "utente"

              });

          }

          /* REVIEWS */

          if(
            filename.includes(
              "reviews"
            )
          ){
console.log(cols);
            const rating =
  cols[2]
    ?.replaceAll('"',"")
    ?.trim();

            const review =
              cols[4]
                ?.replaceAll('"',"")
    ?.trim();


            await supabaseClient
              .from("user_reviews")
                .upsert({

  user_id: user.id,

  username:
  localStorage.getItem(
    "paneacult_username"
  ) ||
  profileUsername?.textContent ||
  "utente",
                   
  movie_id: movie.id,

  title:
  movie.title || movie.name,

  movie_poster: movie.poster_path,
 media_type:
  movie.media_type || "movie",
  rating:
    rating
      ? parseFloat(rating)
      : null,

  review_text:
    review || null

});
          }

          imported++;

           progress.innerHTML = `
<div style="margin-bottom:10px">
Importazione Letterboxd...
</div>

<progress
value="${imported}"
max="100"
style="width:100%;height:18px">
</progress>

<div style="margin-top:10px">
${imported} film importati
</div>
`;
           
        }catch(err){

          console.log(
            err
          );

        }

      }

    }

    alert(
      `${imported} import completati 🎬`
    );
     
importBtn.disabled = false;

importBtn.textContent =
  "Importa da Letterboxd";
     
    location.reload();

  }
);


/* =========================
   TV TIME IMPORT
========================= */

const tvTimeBtn =
  document.getElementById("importTvTimeBtn");

const tvTimeInput =
  document.getElementById("tvtimeImport");

tvTimeBtn?.addEventListener(
  "click",
  () => {

    tvTimeInput.click();

  }
);

tvTimeInput?.addEventListener(
  "change",
  async (e) => {

    const file =
      e.target.files[0];

    if (!file) return;

    const zip =
      await JSZip.loadAsync(file);

    const files =
      Object.keys(zip.files);

    const moviesFile =
      files.find(file =>
        file.includes("movies") &&
        file.endsWith(".json")
      );

    const seriesFile =
      files.find(file =>
        file.includes("series") &&
        file.endsWith(".json")
      );

    const movies =
      JSON.parse(
        await zip
          .file(moviesFile)
          .async("string")
      );

    const series =
      JSON.parse(
        await zip
          .file(seriesFile)
          .async("string")
      );

     
    const {
      data:{ user }
    } =
    await supabaseClient.auth
      .getUser();

    if(!user){

      alert("Login richiesto");

      return;

    }
     
tvTimeBtn.disabled = true;
tvTimeBtn.textContent =
  "Importazione...";

     
let importedMovies = 0;

let importedSeries = 0;

let importedEpisodes = 0;

const notFound = [];
     
     const totalItems =
  movies.length + series.length;

let completedItems = 0;

const progress =
  document.createElement("div");

progress.style.cssText = `
margin-top:16px;
padding:16px;
background:#17384a;
color:#fff;
border-radius:12px;
font-weight:600;
text-align:center;
line-height:1.8;
`;

tvTimeBtn.after(progress);

function updateProgress(type){

  completedItems++;

  const percent =
    Math.round(
      completedItems / totalItems * 100
    );

  progress.innerHTML = `
    <div style="margin-bottom:10px">
      Importazione TV Time...
    </div>

    <progress
      value="${completedItems}"
      max="${totalItems}"
      style="width:100%;height:18px">
    </progress>

    <div style="margin-top:10px">
      ${percent}% completato
    </div>

    <div style="margin-top:6px">
      🎬 ${importedMovies}/${movies.length}
      &nbsp;&nbsp;
      📺 ${importedSeries}/${series.length}
    </div>

    <div style="margin-top:6px;font-size:13px;opacity:.8">
      Ultimo: ${type}
    </div>
  `;

}

     function scoreResult(result, item, mediaType) {

  let score = 0;

  function normalizeTitle(text){

  return (text || "")

    .normalize("NFD")

    .replace(/[\u0300-\u036f]/g, "")

    .replace(/[^\w\s]/g, " ")

    .replace(/\s+/g, " ")

    .trim()

    .toLowerCase();

}

const title =
  normalizeTitle(
    result.title ||
    result.name
  );

const original =
  normalizeTitle(
    result.original_title ||
    result.original_name
  );

const target =
  normalizeTitle(
    item.title ||
    item.name ||
    item.show_name
  );

        
  if (title === target)
    score += 50;

  if (original === target)
    score += 30;

  if (

  title.includes(target) ||

  target.includes(title)

){

  score += 20;

}

if (

  original.includes(target) ||

  target.includes(original)

){

  score += 15;

}
        
  if (result.media_type === mediaType)
    score += 100;

  const year = parseInt(
  (
    result.release_date ||
    result.first_air_date ||
    ""
  ).slice(0, 4)
);

const targetYear =
  parseInt(item.year);

if (!isNaN(year) && !isNaN(targetYear)) {

  const diff =
    Math.abs(year - targetYear);

  if (diff === 0) {

    score += 100;

  } else if (diff === 1) {

    score += 70;

  }

}

  score += Math.min(
    result.popularity || 0,
    20
  );

  return score;

     }

     
     async function searchMovieSmart(title) {

  const attempts = [

    title,

    title.replace(/[:–-]/g, " "),

    title.replace(/\(.*?\)/g, "").trim(),

    title.split(":")[0].trim(),

    title.split("-")[0].trim(),

    title.replace(/[^\w\s]/g, "").trim()

  ];

  const tried = new Set();

  for (const query of attempts) {

    if (!query || tried.has(query)) continue;

    tried.add(query);

    const results =
      await searchMovies(query);

    if (results?.length) {

      return results;

    }

  }

  return [];

     }

       async function importItem(
      item,
      mediaType
    ){

        const title =
  item.title ||
  item.name ||
  item.show_name;

if (!title) {
  return false;
}

let results =
  await searchMovieSmart(title);

if (!results?.length) {

  console.log("❌ Non trovato:", title);

  notFound.push({
    title,
    mediaType
  });

  return false;

}

if (!results || !results.length) {

  console.log("Non trovato:", title);

  return false;

}

          const tmdbItem =
  results
    .sort(
      (a,b)=>
        scoreResult(
          b,
          item,
          mediaType
        ) -
        scoreResult(
          a,
          item,
          mediaType
        )
    )[0];
          
if (
  mediaType === "tv" &&
  item.id?.tvdb
) {

}
          
          console.log(
  "Salvo:",
  tmdbItem.title || tmdbItem.name,
  mediaType
);

          
      const { error } =
        await supabaseClient
          .from("user_movies")
          .upsert(
            {

              user_id:
                user.id,

              movie_id:
                tmdbItem.id,

              title:
                tmdbItem.title ||
                tmdbItem.name,

              poster_path:
                tmdbItem.poster_path,

              release_year:
                item.year,

              media_type:
                mediaType,

              status:
                "watched"

            },
            {
              onConflict:
                "user_id,movie_id,status"
            }
          );

      if(error){

  console.log(error);

  return null;

}

return tmdbItem;

       }
    for (const movie of movies) {

      const tmdbMovie =
  await importItem(
    movie,
    "movie"
  );

if (!tmdbMovie)
  continue;

importedMovies++;

updateProgress(movie.title);

      console.log(
        `🎬 Film ${importedMovies}/${movies.length}`
      );
await new Promise(resolve =>
  setTimeout(resolve, 120)
);
    }
     
      for (const serie of series) {

  const tmdbSerie =
  await importItem(
    serie,
    "tv"
  );

if (!tmdbSerie)
  continue;

  importedSeries++;

  updateProgress(
    serie.title
  );

for (const season of (serie.seasons || [])) {

  for (const episode of (season.episodes || [])) {

    if (!episode.is_watched)
      continue;

    const { error } =
      await supabaseClient
        .from("user_episode_progress")
        .upsert({

          user_id:
            user.id,

          series_id:
            tmdbSerie.id,

          season_number:
            season.number,

          episode_number:
            episode.number,

          watched: true,

          watched_at:
            episode.watched_at,

          rewatch_count:
            episode.rewatch_count || 0

        }, {

          onConflict:
            "user_id,series_id,season_number,episode_number"

        });

    if (error) {
  console.error(
    "❌ ERRORE SALVATAGGIO EPISODIO:",
    {
      serie: serie.title,
      tmdbSerieId: tmdbSerie.id,
      stagione: season.number,
      episodio: episode.number,
      errore: error
    }
  );
} else {
  importedEpisodes++;
    }
  }

}       
      }

     alert(

`✅ Importazione completata

🎬 Film importati: ${importedMovies}

📺 Serie importate: ${importedSeries}

🎞️ Episodi importati: ${importedEpisodes}

❌ Non trovati: ${notFound.length}`

);
     
     
if (notFound.length) {

  console.table(notFound);

}
     
tvTimeBtn.disabled = false;

tvTimeBtn.textContent =
  "Importa da TV Time";

progress.innerHTML = `
<h3 style="margin:0 0 12px">
✅ Importazione completata
</h3>

🎬 Film importati:
<b>${importedMovies}</b>

<br><br>

📺 Serie importate:
<b>${importedSeries}</b>

     🎞️ Episodi importati: 
  <b>${importedEpisodes}</b>
  `; 
    location.reload();

  }
);
     

/* =========================
   RENDER GRID
========================= */

function renderGrid(
  grid,
  movies
){

  if(!grid) return;

  if(movies.length === 0){

    grid.innerHTML = `
    
      <p class="empty-text">
        Nessun film qui!
      </p>
    
    `;

    return;

  }

const isMobile =
  window.innerWidth <= 768;

const moviesToShow =

  isMobile

    ? movies.slice(0,4)

    : movies;
   
grid.innerHTML =

moviesToShow.map(movie => `

    <div
      class="saved-card"
onclick="goToMovie(
  ${
    movie.movie_id || movie.id
  },
  '${
    movie.media_type || "movie"
  }'
)"
    >

      <img
  src="${
    movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : movie.movie_poster ||
        movie.poster ||
        movie.posterUrl ||
        "img/poster-placeholder.webp"
  }"
alt="${
  movie.title ||
  movie.movie_title
}"
>

      <div class="saved-overlay">

<h3>
  ${movie.title || movie.movie_title}
</h3>

<span class="movie-director">
  ${movie.director ? "di " + movie.director : ""}
</span>

      </div>

    </div>

  `).join("");
   
if(
  isMobile &&
  movies.length > 4
){

  let title = "";

  if(
    grid.id === "watchlistGrid"
  ){
    title = "Watchlist";
  }

  if(
    grid.id === "watchedGrid"
  ){
    title = "Watched";
  }

  if(
    grid.id === "favoriteGrid"
  ){
    title = "Loved";
  }

  grid.innerHTML += `

    <button
      class="load-more-btn"
    >
      Vedi tutti (${movies.length})
    </button>

  `;

  const btn =
    grid.querySelector(
      ".load-more-btn"
    );

  btn.onclick = () => {

    openMoviesModal(
      title,
      movies
    );

  };

}
}

function filterWatched(){

  const search =
    document
      .getElementById(
        "watchedSearch"
      )
      ?.value
      .toLowerCase() || "";

  const year =
    document
      .getElementById(
        "watchedYear"
      )
      ?.value || "all";

  const filter =
    document
      .getElementById(
        "watchedFilter"
      )
      ?.value || "all";

  let filtered =
    [...watched];

  /* SEARCH */

  filtered =
  filtered.filter(
    movie =>

      (
        (movie.title || movie.movie_title || "") +
        " " +
        (movie.director || "")
      )
      .toLowerCase()
      .includes(search)

  );

  
  /* YEAR */

  if(year !== "all"){

  filtered = filtered.filter(movie => {

    const y =
      movie.release_year;

    if(year === "new"){
      return y >= 2020;
    }

    if(year === "modern"){
      return y >= 2000 && y < 2020;
    }

    if(year === "classic"){
      return y < 2000;
    }

    return true;

  });
  }

  
  /* ORDER */

  if(filter === "az"){

    filtered.sort(
  (a,b) =>
    (a.title || a.movie_title)
      .localeCompare(
        b.title || b.movie_title
      )
);

  }

  if(filter === "recent"){

    filtered.reverse();

  }

  if(filter === "random"){

    const movie =
      filtered[
        Math.floor(
          Math.random() *
          filtered.length
        )
      ];

    filtered =
      movie ? [movie] : [];

  }

  renderGrid(
    watchedGrid,
    filtered
  );

}


   function filterFavorites(){

  const search =
    document
      .getElementById(
        "favoriteSearch"
      )
      ?.value
      .toLowerCase() || "";

  const genre =
    document
      .getElementById(
        "favoriteGenre"
      )
      ?.value || "all";

  const year =
    document
      .getElementById(
        "favoriteYear"
      )
      ?.value || "all";

  const filter =
    document
      .getElementById(
        "favoriteFilter"
      )
      ?.value || "all";

  let filtered =
    [...favorites];

  /* SEARCH */

  filtered =
  filtered.filter(
    movie =>

      (
        (movie.title || movie.movie_title || "") +
        " " +
        (movie.director || "")
      )
      .toLowerCase()
      .includes(search)

  );

  /* GENRE */

  if(genre !== "all"){

  filtered = filtered.filter(
    movie =>
      movie.genre?.includes(genre)
  );

  }
  /* YEAR */

  if(year !== "all"){

  filtered = filtered.filter(movie => {

    const y =
      movie.release_year;

    if(year === "new"){
      return y >= 2020;
    }

    if(year === "modern"){
      return y >= 2000 && y < 2020;
    }

    if(year === "classic"){
      return y < 2000;
    }

    return true;

  });

  }
  /* ORDER */

  if(filter === "az"){

    filtered.sort(
      (a,b) =>
        a.title.localeCompare(
          b.title
        )
    );

  }

  if(filter === "recent"){

    filtered.reverse();

  }

  if(filter === "random"){

    const movie =
      filtered[
        Math.floor(
          Math.random() *
          filtered.length
        )
      ];

    filtered =
      movie ? [movie] : [];

  }

  renderGrid(
    favoriteGrid,
    filtered
  );  
   }

function filterWatchlist(){

  const search =
    document
      .getElementById(
        "watchlistSearch"
      )
      ?.value
      .toLowerCase() || "";

  const genre =
    document
      .getElementById(
        "watchlistGenre"
      )
      ?.value || "all";

  const year =
    document
      .getElementById(
        "watchlistYear"
      )
      ?.value || "all";

  const filter =
    document
      .getElementById(
        "watchlistFilter"
      )
      ?.value || "all";

  let filtered =
    [...watchlist];

  /* SEARCH */

  filtered =
  filtered.filter(
    movie =>

      (
        (movie.title || movie.movie_title || "") +
        " " +
        (movie.director || "")
      )
      .toLowerCase()
      .includes(search)

  );

  /* GENRE */

  if(genre !== "all"){

    filtered =
  filtered.filter(
    movie =>
      movie.genre?.includes(genre)
  );

  }

  /* YEAR */

  if(year !== "all"){

  filtered = filtered.filter(movie => {

    const y =
      movie.release_year;

    if(year === "new"){
      return y >= 2020;
    }

    if(year === "modern"){
      return y >= 2000 && y < 2020;
    }

    if(year === "classic"){
      return y < 2000;
    }

    return true;

  });

  }
  /* ORDER */

  if(filter === "recent"){

    filtered.reverse();

  }

 if(filter === "az"){

  filtered.sort(
  (a,b) =>
    (a.title || a.movie_title)
      .localeCompare(
        b.title || b.movie_title
      )
);

 }if  

  (filter === "random"){

    const movie =
      filtered[
        Math.floor(
          Math.random() *
          filtered.length
        )
      ];

    filtered =
      movie ? [movie] : [];

  }

  renderGrid(
    watchlistGrid,
    filtered
  );

}

function populateFavoriteFilters(){

  const genreSelect =
    document.getElementById(
      "favoriteGenre"
    );

  if(!genreSelect) return;

  const genres = [...new Set(
  favorites.flatMap(
    movie =>
      movie.genre
        ? movie.genre.split(", ")
        : []
  )
)].sort();

   
  genreSelect.innerHTML = `
    <option value="all">
      Tutti i generi
    </option>
  `;

  genres.forEach(
    genre => {

      genreSelect.innerHTML += `
        <option value="${genre}">
          ${genre}
        </option>
      `;

    }
  );

}

function populateWatchedFilters(){

  const genreSelect =
    document.getElementById(
      "watchedGenre"
    );

  if(!genreSelect) return;

  
const genres =
[...new Set(

  watched.flatMap(
    movie =>
      movie.genre
        ? movie.genre.split(", ")
        : []
  )

)].sort();
   
  genreSelect.innerHTML = `
    <option value="all">
      Tutti i generi
    </option>
  `;

  genres.forEach(
    genre => {

      genreSelect.innerHTML += `
        <option value="${genre}">
          ${genre}
        </option>
      `;

    }
  );

}

function populateWatchlistFilters(){

  const genreSelect =
    document.getElementById(
      "watchlistGenre"
    );

  if(!genreSelect) return;

const genres =
[...new Set(

  watchlist.flatMap(
    movie =>
      movie.genre
        ? movie.genre.split(", ")
        : []
  )

)].sort();

  genreSelect.innerHTML = `
    <option value="all">
      Tutti i generi
    </option>
  `;

  genres.forEach(
    genre => {

      genreSelect.innerHTML += `
        <option value="${genre}">
          ${genre}
        </option>
      `;

    }
  );

}

/* =========================
   CURRENT FAVORITE
========================= */
async function renderCurrentFavorite(){

  if(!currentFavorite) return;

  const {
    data:{ user }
  } =
  await supabaseClient.auth
    .getUser();

  if(!user) return;

  const {
    data: desertMovie
  } =
  await supabaseClient
    .from("user_movies")
    .select("*")
    .eq(
      "user_id",
      user.id
    )
    .eq(
      "status",
      "desert"
    )
    .maybeSingle();

  if(!desertMovie){

    currentFavorite.innerHTML = `
      <p class="empty-text">
        Nessun Desert Island Film.
      </p>
    `;

    return;
  }

  currentFavorite.innerHTML = `

    <img
      src="https://image.tmdb.org/t/p/w500${desertMovie.poster_path}"
      alt="${desertMovie.title}"
    >

    <div class="current-favorite-content">

      <p class="current-label">
        DESERT ISLAND FILM
      </p>

      <h3>
        ${desertMovie.title}
      </h3>

      <span>
        non il migliore.
        quello che porteresti con te su un'isola deserta.
      </span>

    </div>

  `;

  currentFavorite.onclick = () => {

    goToMovie(
      desertMovie.movie_id
    );

  };

}

/* =========================
   SIGNATURE FILMS
========================= */

function renderSignature(){

  if(!signatureGrid) return;

  const movies =
    favorites.slice(0,3);

  signatureGrid.innerHTML =

    movies.map(movie => `

   <div
  class="signature-film"
  onclick="goToMovie(${
    movie.movie_id ||
    movie.id
  })"
>
        <img
  src="${
    movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : movie.poster
  }"
  alt="${
  movie.title ||
  movie.movie_title
}"
>

        <div class="signature-film-overlay">
<h3>
  ${movie.title || movie.movie_title}
</h3>

<span class="movie-director">
  ${movie.director ? "di " + movie.director : ""}
</span>

        </div>

      </div>

    `).join("");

}

async function renderRecentActivity(){

  if(!activityFeed) return;

  const { data:{ user } } =
    await supabaseClient.auth.getUser();

  if(!user) return;

  const { data: reviews } =
    await supabaseClient
      .from("user_reviews")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at",{ascending:false});

  if(!reviews || reviews.length===0){

    activityFeed.innerHTML=`
      <p class="empty-text">
        Nessuna recensione.
      </p>
    `;

    const overlay=document.getElementById("allReviews");
    if(overlay) overlay.innerHTML="";

    return;
  }

  function card(review){

    return `

<div class="review-card">

<img
class="review-poster"
src="https://image.tmdb.org/t/p/w200${review.movie_poster}"
>

<div class="review-content">

<h3 class="review-title">
${review.movie_title}
<span class="review-year">
${review.release_year || ""}
</span>
</h3>

<div class="review-stars">
${renderStars(review.rating)}
</div>

<p class="review-text">
${review.review_text || ""}
</p>

<div class="review-date">
${new Date(review.created_at).toLocaleDateString("it-IT")}
</div>

</div>

<div class="review-actions">

<button
class="review-btn edit-review-btn"
data-id="${review.id}">
<i class="fa-solid fa-pen"></i>
</button>

<button
class="review-btn delete-review-btn"
data-id="${review.id}">
<i class="fa-solid fa-trash"></i>
</button>

</div>

</div>

`;

  }

  activityFeed.innerHTML =
    reviews
      .slice(0,3)
      .map(card)
      .join("");

  const allReviews =
    document.getElementById("allReviews");

  if(allReviews){

    allReviews.innerHTML =
      reviews
        .map(card)
        .join("");

  }

  document
    .querySelectorAll(".edit-review-btn")
    .forEach(btn=>{

      btn.onclick=()=>{

        window.location.href=
`add-review.html?edit=${btn.dataset.id}`;

      };

    });

  document
    .querySelectorAll(".delete-review-btn")
    .forEach(btn=>{

      btn.onclick=async()=>{

        if(!confirm("Eliminare la recensione?"))
          return;

        await supabaseClient
          .from("user_reviews")
          .delete()
          .eq("id",btn.dataset.id);

        await renderRecentActivity();
        updateCounters();

      };

    });

}




/* =========================
   PROFILE COUNTERS
========================= */

function getCinephileLevel(count){

  if(count >= 1000){
    return {
      level: "🎥 Mito del Cinema",
      rank: 4
    };
  }

  if(count >= 500){
    return {
      level: "🎞️ Collezionista",
      rank: 3
    };
  }

  if(count >= 300){
    return {
      level: "🎬 Cinefilo",
      rank: 2
    };
  }

  return {
    level: "🍿 Spettatore",
    rank: 1
  };

}

function getSeriesLevel(count){

    if(count >= 1000){
        return {
            level: "📺 Mito delle Serie",
            rank: 4
        };
    }

    if(count >= 500){
        return {
            level: "📚 Collezionista",
            rank: 3
        };
    }

    if(count >= 300){
        return {
            level: "🔥 Serial addicted",
            rank: 2
        };
    }

    return {
        level: "📺 Spettatore seriale",
        rank: 1
    };
}

async function updateCounters(){


   const tvCount =
  document.getElementById(
     "tvCount"
  
);

   
  const filmsCount =
    document.getElementById(
      "filmsCount"
    );

  const reviewsCount =
    document.getElementById(
      "reviewsCount"
    );
   
const ratedCount =
  document.getElementById(
    "ratedCount"
  );
   
  const favoritesCount =
    document.getElementById(
      "favoritesCount"
    );

   const tvFavoritesCount =
  document.getElementById(
    "tvFavoritesCount"
  );
   
   const {
  data:{ user }
} =
await supabaseClient.auth
  .getUser();

if(!user) return;
let watchedCloud = [];

let from = 0;
const pageSize = 1000;

while (true) {

  const {
    data,
    error
  } =
  await supabaseClient
    .from("user_movies")
    .select("*")
    .eq(
      "user_id",
      user.id
    )
    .eq(
      "status",
      "watched"
    )
    .range(
      from,
      from + pageSize - 1
    );

  if (error) {
    console.error(
      "Errore caricamento user_movies:",
      error
    );
    break;
  }

  if (!data || data.length === 0) {
    break;
  }

  watchedCloud.push(...data);

  if (data.length < pageSize) {
    break;
  }

  from += pageSize;
}

   
   const watchedMovies =
  watchedCloud?.filter(
    item => item.media_type === "movie"
  ) || [];

const watchedTv =
  watchedCloud?.filter(
    item => item.media_type === "tv"
  ) || [];


const seriesLevel = document.getElementById("seriesLevel");

if (seriesLevel) {
    const currentSeriesLevel = getSeriesLevel(watchedTv.length);
    seriesLevel.textContent = currentSeriesLevel.level;
}
   
if (filmsCount) {
  filmsCount.textContent = watchedMovies.length;
}

if (tvCount) {
  tvCount.textContent = watchedTv.length;
}

   /* Avvia il watch time dopo aver aggiornato subito i contatori */

updateWatchTime(
  watchedMovies,
  watchedTv,
  user
);

   
const cinephileLevel =
  document.getElementById(
    "cinephileLevel"
  );


async function updateWatchTime(watchedMovies, watchedTv, user) {

  /* =========================================================
     WATCH TIME VELOCE
     ========================================================= */

  const watchTimeCacheKey =
    `paneacult_watch_time_v3_${user.id}`;

  function formatWatchTime(minutes) {

    const total = Math.round(Number(minutes) || 0);

    const days = Math.floor(total / 1440);
    const hours = Math.floor((total % 1440) / 60);
    const mins = total % 60;

    return `${days}g ${hours}h ${mins}m`;
  }


  function renderWatchTime(movieMinutes, tvMinutes) {

    const movieTime =
      document.getElementById("movieWatchTime");

    const tvTime =
      document.getElementById("tvWatchTime");

    const totalTime =
      document.getElementById("totalWatchTime");

    const totalMinutes =
      (Number(movieMinutes) || 0) +
      (Number(tvMinutes) || 0);

    if (movieTime) {
      movieTime.textContent =
        formatWatchTime(movieMinutes);
    }

    if (tvTime) {
      tvTime.textContent =
        formatWatchTime(tvMinutes);
    }

    if (totalTime) {
      totalTime.textContent =
        formatWatchTime(totalMinutes);
    }
  }


  /* =========================================================
     MOSTRA SUBITO IL RISULTATO PRECEDENTE
     ========================================================= */

  try {

    const cached =
      JSON.parse(
        localStorage.getItem(watchTimeCacheKey)
      );

    if (
      cached &&
      Number.isFinite(Number(cached.movieMinutes)) &&
      Number.isFinite(Number(cached.tvMinutes))
    ) {

      renderWatchTime(
        cached.movieMinutes,
        cached.tvMinutes
      );

      console.log(
        "⚡ Watch time mostrato dalla cache"
      );
    }

  } catch (error) {

    console.warn(
      "Cache watch time non leggibile:",
      error
    );
  }


  let movieMinutes = 0;
  let tvMinutes = 0;


  /* =========================================================
     CACHE DURATE TMDB
     ========================================================= */

  function getRuntimeCache(type, id) {

    if (!id) return null;

    const key =
      `paneacult_runtime_v3_${type}_${id}`;

    const value =
      Number(localStorage.getItem(key));

    return (
      Number.isFinite(value) &&
      value > 0
    )
      ? value
      : null;
  }


  function saveRuntimeCache(type, id, runtime) {

    if (
      !id ||
      !Number.isFinite(Number(runtime)) ||
      Number(runtime) <= 0
    ) {
      return;
    }

    localStorage.setItem(
      `paneacult_runtime_v3_${type}_${id}`,
      String(runtime)
    );
  }


  /* =========================================================
     DURATA FILM
     ========================================================= */

  async function getMovieRuntime(movie) {

    const movieId =
      movie?.movie_id ??
      movie?.id ??
      null;

    if (!movieId) return 0;


    /* Prima controlliamo la cache */

    const cached =
      getRuntimeCache(
        "movie",
        movieId
      );

    if (cached !== null) {
      return cached;
    }


    /* Se non c'è, chiediamo a TMDB */

    try {

      const details =
        await fetchMovieDetails(
          movieId,
          "movie"
        );

      const runtime =
        Number(details?.runtime);

      if (
        Number.isFinite(runtime) &&
        runtime > 0
      ) {

        saveRuntimeCache(
          "movie",
          movieId,
          runtime
        );

        return runtime;
      }

    } catch (error) {

      console.error(
        "❌ Errore durata film:",
        movie.title || movie.movie_title,
        error
      );
    }

    return 0;
  }


  /* =========================================================
     CALCOLO A GRUPPI
     ========================================================= */

  async function sumRuntimes(
    items,
    getRuntime,
    batchSize = 8
  ) {

    let total = 0;

    for (
      let i = 0;
      i < items.length;
      i += batchSize
    ) {

      const batch =
        items.slice(
          i,
          i + batchSize
        );

      const runtimes =
        await Promise.all(
          batch.map(getRuntime)
        );

      total +=
        runtimes.reduce(
          (sum, runtime) =>
            sum + (Number(runtime) || 0),
          0
        );
    }

    return total;
  }


  /* =========================================================
     FILM
     ========================================================= */

  movieMinutes =
    await sumRuntimes(
      watchedMovies || [],
      getMovieRuntime,
      8
    );


  console.log(
    "🎬 TOTALE FILM:",
    movieMinutes,
    "minuti"
  );


  /* =========================================================
     EPISODI SERIE TV
     ========================================================= */

  try {

  let episodes = [];
  let from = 0;
  const pageSize = 1000;

  while (true) {

    const {
      data,
      error: episodesError
    } = await supabaseClient
      .from("user_episode_progress")
      .select("series_id,season_number,episode_number,watched")
      .eq("user_id", user.id)
      .eq("watched", true)
      .range(from, from + pageSize - 1);

    if (episodesError) {
      console.error(
        "❌ Errore caricamento episodi:",
        episodesError
      );
      break;
    }

    if (!data || data.length === 0) {
      break;
    }

    episodes.push(...data);

    if (data.length < pageSize) {
      break;
    }

    from += pageSize;
  }

  console.log(
    "📺 Episodi trovati:",
    episodes.length
  );


      /* =====================================================
         UNA SOLA RICHIESTA PER OGNI SERIE
         ===================================================== */

      const seriesIds =
        [
          ...new Set(
            (episodes || [])
              .map(
                ep => ep?.series_id
              )
              .filter(Boolean)
          )
        ];


      const seriesRuntimeCache =
        new Map();

   const seriesEpisodeRuntimeCache = new Map();

async function getEpisodeRuntime(seriesId, seasonNumber, episodeNumber) {

  if (!seriesId || seasonNumber == null || episodeNumber == null) {
    return 0;
  }

  const seasonKey =
    `${seriesId}_${seasonNumber}`;

  let seasonEpisodes =
    seriesEpisodeRuntimeCache.get(seasonKey);

  // Se non abbiamo ancora caricato questa stagione
  if (!seasonEpisodes) {

    seasonEpisodes = new Map();

    try {

      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${seriesId}/season/${seasonNumber}?api_key=${API_KEY}&language=it-IT`
      );

      if (!response.ok) {

        console.warn(
          "⚠️ TMDB errore stagione:",
          seriesId,
          seasonNumber,
          response.status
        );

        seriesEpisodeRuntimeCache.set(
          seasonKey,
          seasonEpisodes
        );

        return 0;
      }

      const details =
        await response.json();

      (details?.episodes || [])
        .forEach(ep => {

          const runtime =
            Number(ep?.runtime) || 0;

          if (ep?.episode_number != null) {

            seasonEpisodes.set(
              Number(ep.episode_number),
              runtime
            );

          }

        });

    } catch (error) {

      console.error(
        "❌ Errore durata stagione:",
        seriesId,
        seasonNumber,
        error
      );

    }

    seriesEpisodeRuntimeCache.set(
      seasonKey,
      seasonEpisodes
    );
  }

  return (
    seasonEpisodes.get(
      Number(episodeNumber)
    ) || 0
  );
}

      async function getSeriesRuntime(seriesId) {

        if (!seriesId) return 0;


        /* Cache locale permanente */

        const cached =
          getRuntimeCache(
            "tv",
            seriesId
          );

        if (cached !== null) {
          return cached;
        }


        let runtime = 0;


        try {

          const response =
            await fetch(
              `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${API_KEY}&language=it-IT`
            );


          if (!response.ok) {

            console.warn(
              "⚠️ TMDB errore serie:",
              seriesId,
              response.status
            );

            return 0;
          }


          const details =
            await response.json();


          if (
            Array.isArray(
              details?.episode_run_time
            )
          ) {

            const validTimes =
              details.episode_run_time
                .map(Number)
                .filter(
                  n =>
                    Number.isFinite(n) &&
                    n > 0
                );


            if (validTimes.length) {

              runtime =
                validTimes.reduce(
                  (sum, value) =>
                    sum + value,
                  0
                ) /
                validTimes.length;
            }
          }


          /* Fallback */

          if (!runtime) {

            runtime =
              Number(details?.runtime) || 0;
          }


          if (runtime > 0) {

            saveRuntimeCache(
              "tv",
              seriesId,
              runtime
            );
          }


        } catch (error) {

          console.error(
            "❌ Errore durata serie:",
            seriesId,
            error
          );
        }


        return runtime;
      }


      /* =====================================================
         RECUPERIAMO LE DURATE DELLE SERIE A GRUPPI DI 8
         ===================================================== */

      for (
        let i = 0;
        i < seriesIds.length;
        i += 8
      ) {

        const batch =
          seriesIds.slice(
            i,
            i + 8
          );


        const runtimes =
          await Promise.all(
            batch.map(
              seriesId =>
                getSeriesRuntime(
                  seriesId
                ).then(
                  runtime => ({
                    seriesId,
                    runtime
                  })
                )
            )
          );


        runtimes.forEach(
          ({
            seriesId,
            runtime
          }) => {

            seriesRuntimeCache.set(
              seriesId,
              runtime
            );
          }
        );
      }


      /* =====================================================
         SOMMIAMO LA DURATA DI OGNI EPISODIO VISTO
         ===================================================== */

      for (
        const episode of episodes || []
      ) {

        const runtime =
          seriesRuntimeCache.get(
            episode?.series_id
          ) || 0;

        tvMinutes += runtime;
      }


  } catch (error) {

    console.error(
      "❌ Errore generale Watch Time TV:",
      error
    );
  }


  /* =========================================================
     RISULTATO FINALE
     ========================================================= */

  const totalMinutes =
    movieMinutes +
    tvMinutes;


  /* =========================================================
     SALVIAMO IL RISULTATO
     ========================================================= */

  try {

    localStorage.setItem(
      watchTimeCacheKey,
      JSON.stringify({
        movieMinutes,
        tvMinutes,
        totalMinutes,
        savedAt: Date.now()
      })
    );

  } catch (error) {

    console.warn(
      "Impossibile salvare watch time:",
      error
    );
  }


  /* =========================================================
     AGGIORNA LA GRAFICA
     ========================================================= */

  renderWatchTime(
    movieMinutes,
    tvMinutes
  );


  console.log(
    "⚡ WATCH TIME AGGIORNATO",
    {
      movieMinutes,
      tvMinutes,
      totalMinutes
    }
  );
}
   
if(cinephileLevel){

  const watched =
  watchedMovies.length;

  const currentLevel =
    getCinephileLevel(watched);

   const {
  data: profile
} = await supabaseClient
  .from("profiles")
  .select("cinephile_rank")
  .eq("id", user.id)
  .single();

const previousRank =
  profile?.cinephile_rank || 1;

cinephileLevel.textContent =
    currentLevel.level;
   
if(currentLevel.rank > previousRank){

  alert(
    `🎉 Congratulazioni!\n\nHai raggiunto il livello\n${currentLevel.level}!`
  );

  await supabaseClient
    .from("profiles")
    .update({
      cinephile_rank: currentLevel.rank
    })
    .eq("id", user.id);
}
}
   
  if (
  user &&
  tvFavoritesCount
) {

  const { count } =
    await supabaseClient
      .from("user_movies")
      .select("*", {
        count: "exact",
        head: true
      })
      .eq("user_id", user.id)
      .eq("status", "favorite")
      .eq("media_type", "tv");

  tvFavoritesCount.textContent =
    count || 0;

  }

   if(
  user &&
  reviewsCount
){

  const {
    count
  } =
  await supabaseClient
    .from(
      "user_reviews"
    )
    .select(
      "*",
      {
        count:"exact",
        head:true
      }
    )
    .eq(
      "user_id",
      user.id
    )
    .not(
      "review_text",
      "is",
      null
    );

  reviewsCount.textContent =
    count || 0;
  }
if(
  user &&
  ratedCount
){

  const {
    count
  } =
  await supabaseClient
    .from(
      "user_reviews"
    )
    .select(
      "*",
      {
        count:"exact",
        head:true
      }
    )
    .eq(
      "user_id",
      user.id
    )
    .not(
      "rating",
      "is",
      null
    );

  ratedCount.textContent =
    count || 0;

   document.getElementById("cinephileLevel").textContent =
    getCinephileLevel(watchedMovies.length).level;

document.getElementById("seriesLevel").textContent =
    getSeriesLevel(watchedTv.length).level;


         }
}



/* =========================
   INIT
========================= */
loadWatched();
loadTvWatched();

loadWatchlist();
loadTvWatchlist();

loadFavorites();
loadTvFavorites();

renderCurrentFavorite();

renderSignature();

renderRecentActivity();

updateCounters();
/* =========================
   CUSTOM PROFILE
========================= */

const avatarInput =
  document.getElementById(
    "avatarInput"
  );

const usernameInput =
  document.getElementById(
    "usernameInput"
  );

const bioInput =
  document.getElementById(
    "bioInput"
  );

const saveProfileBtn =
  document.getElementById(
    "saveProfileBtn"
  );

const profileAvatarImg =
  document.getElementById(
    "profileAvatarImg"
  );

const profileUsername =
  document.getElementById(
    "profileUsername"
  );

const profileBio =
  document.getElementById(
    "profileBio"
  );

const profileEdit =
  document.querySelector(
    ".profile-edit"
  );

/* LOAD */

(async () => {

  const {
    data: { user }
  } = await supabaseClient.auth.getUser();

  if (!user) return;

  const { data: profile, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) return;

  if (profile.username && profileUsername) {
    profileUsername.textContent = profile.username;

    if (usernameInput) {
      usernameInput.value = profile.username;
    }
  }

  if (profile.bio && profileBio) {
    profileBio.textContent = profile.bio;

    if (bioInput) {
      bioInput.value = profile.bio;
    }
  }

  if (profile.avatar_url && profileAvatarImg) {
    profileAvatarImg.src = profile.avatar_url;
  }

})();

/* SAVE */

saveProfileBtn?.addEventListener("click", async () => {
   
    const newUsername =
      usernameInput?.value.trim();

    const newBio =
      bioInput?.value.trim();

    if(
      newUsername &&
      profileUsername
    ){

      profileUsername.textContent =
        newUsername;

      localStorage.setItem(
        "paneacult_username",
        newUsername
      );

    }

    if(
      newBio &&
      profileBio
    ){

      profileBio.textContent =
        newBio;

      localStorage.setItem(
        "paneacult_bio",
        newBio
      );


       const {
  data: { user }
} = await supabaseClient.auth.getUser();

if (!user) {
  console.log("Utente non trovato");
  return;
}

const { data, error } = await supabaseClient
  .from("profiles")
  .upsert({
    id: user.id,
    username: newUsername,
    bio: newBio
  })
  .select();

console.log("USER:", user);
console.log("DATA:", data);
console.log("ERROR:", error);
       
    }

    if(
      avatarInput?.files?.[0]
    ){

      const reader =
        new FileReader();

      reader.onload =
        e => {

          profileAvatarImg.src =
            e.target.result;

          localStorage.setItem(
            "paneacult_avatar",
            e.target.result
          );

        };

      reader.readAsDataURL(
        avatarInput.files[0]
      );

    }
profileEdit.classList.remove(
  "open"
);
  }
);

const editBtn =
  document.getElementById(
    "editProfileBtn"
  );

editBtn?.addEventListener(
  "click",
  () => {

    profileEdit.classList.toggle(
      "open"
    );

  }
);

function openMoviesModal(
  title,
  movies
){

  const modal =
    document.getElementById(
      "moviesModal"
    );

  modal.innerHTML = `

    <button
      class="modal-close"
    >
      ← Chiudi
    </button>

    <h2>
      ${title}
    </h2>

    <div class="modal-grid">

      ${movies.map(movie => `

        <div
          class="saved-card"
          onclick="goToMovie(${
            movie.movie_id ||
            movie.id
          })"
        >

          <img
            src="${
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : movie.movie_poster ||
                  movie.poster ||
                  movie.posterUrl ||
                  'img/poster-placeholder.webp'
            }"
          >

          <div
            class="saved-overlay"
          >

            <h3>
  ${movie.title || movie.movie_title}
</h3>

<span class="movie-director">
  ${movie.director ? "di " + movie.director : ""}
</span>
          </div>

        </div>

      `).join("")}

    </div>

  `;

  modal.classList.add(
    "open"
  );

  modal
    .querySelector(
      ".modal-close"
    )
    .onclick = () => {

      modal.classList.remove(
        "open"
      );

    };

}

function goToMovie(id){

  if(!id){

    console.log(
      "movie id mancante"
    );

    return;

  }

  window.location.href =
    `add-review.html?id=${id}`;

}



/* =========================
   EVENTI FILTRI
========================= */

document
  .getElementById("watchlistSearch")
  ?.addEventListener(
    "input",
    filterWatchlist
  );

document
  .getElementById("watchlistGenre")
  ?.addEventListener(
    "change",
    filterWatchlist
  );

document
  .getElementById("watchlistYear")
  ?.addEventListener(
    "change",
    filterWatchlist
  );

document
  .getElementById("watchlistFilter")
  ?.addEventListener(
    "change",
    filterWatchlist
  );


document
  .getElementById("watchedSearch")
  ?.addEventListener(
    "input",
    filterWatched
  );

document
  .getElementById("watchedGenre")
  ?.addEventListener(
    "change",
    filterWatched
  );

document
  .getElementById("watchedYear")
  ?.addEventListener(
    "change",
    filterWatched
  );

document
  .getElementById("watchedFilter")
  ?.addEventListener(
    "change",
    filterWatched
  );


document
  .getElementById("favoriteSearch")
  ?.addEventListener(
    "input",
    filterFavorites
  );

document
  .getElementById("favoriteGenre")
  ?.addEventListener(
    "change",
    filterFavorites
  );

document
  .getElementById("favoriteYear")
  ?.addEventListener(
    "change",
    filterFavorites
  );

document
  .getElementById("favoriteFilter")
  ?.addEventListener(
    "change",
    filterFavorites
  );
