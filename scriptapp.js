const supabaseUrl = "https://czvtirkuyhcilmzbwysf.supabase.co"

const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6dnRpcmt1eWhjaWxtemJ3eXNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczOTM1NjIsImV4cCI6MjA5Mjk2OTU2Mn0.v--ZBxJyMAIpb1bWbN6J3DUDi5FfcoOrhKccwRyuEvw"

const supabaseClient = window.supabase.createClient(
  supabaseUrl,
  supabaseKey
)

console.log("JS CARICATO")

// ===== DATI =====
let films = []
let search = ""

// ===== UX =====
async function signUp(email, password) {
  return await supabaseClient.auth.signUp({ email, password })
}

async function signIn(email, password) {
  return await supabaseClient.auth.signInWithPassword({ email, password })
}

function vibrate() {
  if (navigator.vibrate) navigator.vibrate(30)
}

// ===== LOAD FILMS =====
async function loadFilms() {
  const { data: { user } } = await supabaseClient.auth.getUser()

  if (!user) return

  const { data, error } = await supabaseClient
    .from("films")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.log(error)
    return
  }

  films = data || []
  renderFilms()
}

// ===== RENDER =====
function renderFilms() {

  const list = document.getElementById("list")
  if (!list) return

  list.innerHTML = ""

  films
    .map((film, i) => ({ film, i }))
    .filter(obj =>
      obj.film.title.toLowerCase().includes(search)
    )
    .forEach(({ film, i }) => {

      const div = document.createElement("div")
      div.className = "film-card"

      div.innerHTML = `
        <img 
          class="film-poster" 
          src="${film.poster || 'https://via.placeholder.com/300x450'}"
        >

        <div class="film-info">

          <h3 class="film-title ${film.watched ? 'watched' : ''}">
            ${film.title}
          </h3>

          <div class="film-rating">
            ${[1,2,3,4,5].map(n => `
              <span onclick="setRating(${i}, ${n})">
                ${n <= (film.rating || 0) ? "⭐" : "☆"}
              </span>
            `).join("")}
          </div>

          <div class="film-actions">

            <button onclick="toggleWatched(${i})">
              ${film.watched ? "✔ Visto" : "Visto"}
            </button>

            <button onclick="toggleFavorite(${i})">
              ${film.favorite ? "★" : "☆"}
            </button>

            <button onclick="deleteFilm(${i})">
              ❌
            </button>

          </div>

        </div>
      `

      list.appendChild(div)
    })
}

// ===== POSTER =====
async function fetchPoster(title) {

  const apiKey = "3688d1b3985d41091da268200e1841ef"

  try {

    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(title)}`

    const res = await fetch(url)
    const data = await res.json()

    if (
      data.results &&
      data.results.length > 0 &&
      data.results[0].poster_path
    ) {
      return "https://image.tmdb.org/t/p/w500" +
        data.results[0].poster_path
    }

  } catch (e) {
    console.log("Errore poster:", e)
  }

  return "https://via.placeholder.com/300x450?text=No+Image"
}

// ===== AGGIUNGI =====
window.addFilm = async function () {

  const input = document.getElementById("title")
  if (!input) return

  const title = input.value.trim()

  if (!title) return

  const normalizedTitle = title
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()

  const exists = films.some(f =>
    f.title.toLowerCase().replace(/\s+/g, " ").trim()
    === normalizedTitle
  )

  if (exists) {
    showToast("Film già presente 🎬")
    return
  }

  const { data: { user } } =
    await supabaseClient.auth.getUser()

  if (!user) {
    alert("Devi fare login")
    return
  }

  vibrate()

  const poster = await fetchPoster(title)

  const { error } = await supabaseClient
    .from("films")
    .insert({
      user_id: user.id,
      title,
      rating: 0,
      poster,
      favorite: false,
      watched: false
    })

  if (error) {
    console.log(error)
    return
  }

  input.value = ""

  const box = document.getElementById("suggestions")
  if (box) box.innerHTML = ""

  closeModal()
  loadFilms()
}

// ===== AZIONI =====
window.deleteFilm = function(index) {
  vibrate()
  films.splice(index, 1)
  renderFilms()
}

window.setRating = function(index, rating) {
  vibrate()
  films[index].rating = rating
  renderFilms()
}

window.toggleWatched = function(index) {
  vibrate()
  films[index].watched = !films[index].watched
  renderFilms()
}

window.toggleFavorite = function(index) {
  vibrate()
  films[index].favorite = !films[index].favorite
  renderFilms()
}

// ===== RICERCA =====
window.setSearch = function(value) {
  search = value.toLowerCase()
  renderFilms()
}

// ===== AUTOCOMPLETE =====
window.handleInput = function(value) {
  fetchSuggestions(value)
}

// ===== LOGIN =====
window.login = async function () {

  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  if (!email || !password) {
    alert("Inserisci email e password")
    return
  }

  const { error } = await signIn(email, password)

  if (error) {

    alert(error.message)

  } else {

    document.getElementById("auth").style.display = "none"

    document.querySelector(".container").style.display = "block"

    loadFilms()
  }
}

window.register = async function () {

  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  if (!email || !password) {
    alert("Inserisci email e password")
    return
  }

  const { error } = await signUp(email, password)

  if (error) {

    alert(error.message)

  } else {

    alert("Controlla la mail per confermare l'account 📩")

  }
}
// ===== SUGGESTIONS =====
async function fetchSuggestions(query) {

  const box = document.getElementById("suggestions")

  if (!query) {
    box.innerHTML = ""
    return
  }

  const apiKey = "3688d1b3985d41091da268200e1841ef"

  try {

    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`

    const res = await fetch(url)
    const data = await res.json()

    showSuggestions(data.results.slice(0, 5))

  } catch (e) {

    console.log("Errore autocomplete:", e)

  }
}

function showSuggestions(results) {

  const box = document.getElementById("suggestions")

  box.innerHTML = ""

  results.forEach(movie => {

    const div = document.createElement("div")

    div.className = "suggestion"

    div.textContent = movie.title

    div.onclick = (e) => {

      e.stopPropagation()

      document.getElementById("title").value = movie.title

      box.innerHTML = ""
    }

    box.appendChild(div)
  })
}

// ===== TOAST =====
function showToast(text) {

  const toast = document.getElementById("toast")

  if (!toast) return

  toast.textContent = text

  toast.classList.add("show")

  setTimeout(() => {
    toast.classList.remove("show")
  }, 2000)
}

// ===== MODAL =====
window.openModal = function() {

  const modal = document.getElementById("addModal")

  if (!modal) return

  modal.classList.add("active")

  document.body.style.overflow = "hidden"

  setTimeout(() => {
    document.getElementById("title").focus()
  }, 200)
}

window.closeModal = function() {

  const modal = document.getElementById("addModal")

  if (!modal) return

  modal.classList.remove("active")

  document.body.style.overflow = ""
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {

  const fab = document.querySelector(".fab")

  if (fab) {

    fab.addEventListener("click", (e) => {

      e.stopPropagation()

      openModal()

    })
  }

  document.addEventListener("click", (e) => {

    const modal = document.getElementById("addModal")
    const content = document.querySelector(".modal-content")

    if (!modal || !modal.classList.contains("active")) return

    if (!content) return

    if (e.target.closest(".fab")) return

    if (content.contains(e.target)) return

    if (e.target.closest(".suggestion")) return

    closeModal()
  })
})

// ===== AUTO LOGIN =====
window.addEventListener("load", async () => {

  const { data } = await supabaseClient.auth.getUser()

  if (data.user) {

    document.getElementById("auth").style.display = "none"

    document.querySelector(".container").style.display = "block"

    loadFilms()
  }
})

// ===== AVVIO =====
loadFilms()
