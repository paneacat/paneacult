/* =========================
   TV TIME IMPORT
========================= */

const tvTimeBtn = importBtn;

const tvTimeInput = importInput;

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

     const tvdbToTmdb =
  new Map();
     
     
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
  await searchMovies(title);

/* secondo tentativo */

if (!results?.length) {

  results =
    await searchMovies(
      title.replace(/[:\-–]/g, " ")
    );

}

/* terzo tentativo */

if (!results?.length) {

  results =
    await searchMovies(
      title.split(":")[0].trim()
    );

}

/* quarto tentativo */

if (!results?.length) {

  results =
    await searchMovies(
      title.split("-")[0].trim()
    );

}

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

  tvdbToTmdb.set(
    item.id.tvdb,
    tmdbItem.id
  );

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

        console.log(
          error
        );

        return false;

      }

      return true;

       }
    for (const movie of movies) {

      const imported =
        await importItem(
          movie,
          "movie"
        );

      if (imported) {

        importedMovies++;
        updateProgress(movie.title);
      }

      console.log(
        `🎬 Film ${importedMovies}/${movies.length}`
      );
await new Promise(resolve =>
  setTimeout(resolve, 120)
);
    }
     
      for (const serie of series) {

      const imported =
        await importItem(
          serie,
          "tv"
        );

      if (imported) {

        importedSeries++;
        updateProgress(serie.title || serie.name);
      }

      console.log(
        `📺 Serie ${importedSeries}/${series.length}`
      );
await new Promise(resolve =>
  setTimeout(resolve, 120)
);
      }



     /* =========================
   IMPORT EPISODI
========================= */

let importedEpisodes = 0;

for (const row of episodes) {

  try {

    const cols = row.split(",");

    const seriesTvdbId =
      Number(cols[0]);

    const seasonNumber =
      Number(cols[2]);

    const episodeNumber =
      Number(cols[3]);

    const watched =
      cols[6] === "true";

    const watchedAt =
      cols[7]
        ? new Date(cols[7]).toISOString()
        : null;

    const rewatchCount =
      Number(cols[8] || 0);

    if (!watched)
      continue;

    const seriesId =
      tvdbToTmdb.get(seriesTvdbId);

    if (!seriesId)
      continue;

    const { error } =
      await supabaseClient
        .from("user_episode_progress")
        .upsert(
          {

            user_id:
              user.id,

            series_id:
              seriesId,

            season_number:
              seasonNumber,

            episode_number:
              episodeNumber,

            watched: true,

            watched_at:
              watchedAt,

            rewatch_count:
              rewatchCount

          },
          {
            onConflict:
              "user_id,series_id,season_number,episode_number"
          }
        );

    if (!error) {

      importedEpisodes++;

    }

  } catch (err) {

    console.log(
      "Errore episodio:",
      err
    );

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
`;
    location.reload();

  }
);
     
