document.addEventListener('DOMContentLoaded', () => {

  // ===============================
  // ===== FILTRI (NUOVO SISTEMA)
  // ===============================
  const buttons = document.querySelectorAll('.filter');
  const cards = document.querySelectorAll('.archivio-card');
  const resetBtn = document.getElementById('resetFilters');

  let activeFilters = {
    tipo: "all",
    genere: "all"
  };

  if (buttons.length && cards.length) {

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {

        const group = btn.dataset.group; // tipo / genere
        const filter = btn.dataset.filter;

        // reset gruppo
        document.querySelectorAll(`.filter[data-group="${group}"]`)
          .forEach(b => b.classList.remove('active'));

        btn.classList.add('active');

        activeFilters[group] = filter;

        filterCards();
      });
    });

    // ===== FUNZIONE FILTRI
    function filterCards() {
      cards.forEach(card => {

        const tags = (card.dataset.category || "").split(' ');

        const matchTipo =
          activeFilters.tipo === "all" ||
          tags.includes(activeFilters.tipo);

        const matchGenere =
          activeFilters.genere === "all" ||
          tags.includes(activeFilters.genere);

        if (matchTipo && matchGenere) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }

      });
    }

    // ===============================
    // ===== RESET FILTRI ↺
    // ===============================
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {

        // reset stato
        activeFilters.tipo = "all";
        activeFilters.genere = "all";

        // rimuove active da tutti
        buttons.forEach(btn => btn.classList.remove('active'));

        // riattiva "Tutti"
        document.querySelectorAll('.filter[data-group="tipo"][data-filter="all"]')
          .forEach(btn => btn.classList.add('active'));

        // mostra tutte le card
        cards.forEach(card => {
          card.style.display = "block";
        });

      });
    }

  }

  // ===============================
  // ===== SLIDER
  // ===============================
  const slider = document.getElementById("slider");
  const next = document.getElementById("next");
  const prev = document.getElementById("prev");

  if (slider && next && prev) {

    function updateArrows() {
      const maxScroll = slider.scrollWidth - slider.clientWidth;

      if (slider.scrollLeft >= maxScroll - 10) {
        prev.style.opacity = "1";
        prev.style.pointerEvents = "auto";
      } else {
        prev.style.opacity = "0";
        prev.style.pointerEvents = "none";
      }
    }

    next.addEventListener("click", () => {
      slider.scrollBy({
        left: slider.clientWidth,
        behavior: "smooth"
      });
    });

    prev.addEventListener("click", () => {
      slider.scrollTo({
        left: 0,
        behavior: "smooth"
      });
    });

    slider.addEventListener("scroll", updateArrows);

    updateArrows();
  }

  // ===============================
  // ===== CREDITS (fade)
  // ===============================
  const credits = document.querySelector('.credits');

  if (credits) {
    const observerCredits = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          credits.classList.add('show');
        }
      });
    }, { threshold: 0.3 });

    observerCredits.observe(credits);
  }

  window.addEventListener("load", () => {
  const splash = document.getElementById("splash");
  setTimeout(() => {
    splash.style.opacity = "0";
    splash.style.transition = "0.4s";
    setTimeout(() => splash.remove(), 400);
  }, 800);
});

  // ===============================
  // ===== FADE-UP GENERALE
  // ===============================
  const elements = document.querySelectorAll('.fade-up');

  if (elements.length) {

    setTimeout(() => {
      elements.forEach(el => el.classList.add('show'));
    }, 200);

    const observerFade = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, { threshold: 0.2 });

    elements.forEach(el => observerFade.observe(el));
  }

});
// ===============================
// ===== APP FILM (LOGIN PAGE)
// ===============================

let films = [
  {
    id: "1",
    title: "Diamanti grezzi",
    poster: "https://image.tmdb.org/t/p/w500/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg",
    rating: 4
  },
  {
    id: "2",
    title: "Il grande dittatore",
    poster: "https://image.tmdb.org/t/p/w500/9uSg7JQq2z8S9oCz6YtYyqS9K2k.jpg",
    rating: 5
  }
];

// render film
function renderFilms(listFilms = films) {
  const list = document.getElementById("list");
  if (!list) return;

  list.innerHTML = listFilms.map(film => `
    <div class="film-card">

      <img src="${film.poster}" />

      <div class="film-info">
        <h3>${film.title}</h3>

        <div class="stars">
          ${[1,2,3,4,5].map(n => `
            <span onclick="rateFilm('${film.id}', ${n})">
              ${n <= film.rating ? "★" : "☆"}
            </span>
          `).join("")}
        </div>
      </div>

    </div>
  `).join("");
}

// rating
function rateFilm(id, rating) {
  films = films.map(f =>
    f.id === id ? { ...f, rating } : f
  );

  renderFilms();
}

// search
function setSearch(value) {
  const filtered = films.filter(f =>
    f.title.toLowerCase().includes(value.toLowerCase())
  );

  renderFilms(filtered);
}

// modal
function openModal() {
  document.getElementById("addModal").style.display = "block";
}

function closeModal() {
  document.getElementById("addModal").style.display = "none";
}

// aggiungi film
function addFilm() {
  const title = document.getElementById("title").value;

  if (!title) return;

  films.push({
    id: Date.now().toString(),
    title,
    poster: "https://via.placeholder.com/300x450",
    rating: 0
  });

  closeModal();
  renderFilms();
}

// primo render
document.addEventListener("DOMContentLoaded", () => {
  renderFilms();
});
