<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>paneacult | In arrivo</title>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<style>
*{
margin:0;
padding:0;
box-sizing:border-box;
}

body{
font-family:Poppins,sans-serif;
background:#0f1115;
color:#fff;
display:flex;
justify-content:center;
align-items:center;
min-height:100vh;
padding:40px 20px;
}

.container{
width:100%;
max-width:900px;
}

.hero{
text-align:center;
margin-bottom:70px;
}

.logo{
font-size:56px;
font-weight:700;
color:#ffbf00;
margin-bottom:20px;
}

.badge{
display:inline-block;
padding:8px 16px;
background:#1c2028;
border-radius:50px;
font-size:14px;
margin-bottom:25px;
}

h1{
font-size:46px;
line-height:1.2;
margin-bottom:20px;
}

.subtitle{
max-width:650px;
margin:auto;
font-size:18px;
opacity:.8;
line-height:1.7;
margin-bottom:35px;
}

form{
display:flex;
flex-direction:column;
gap:15px;
max-width:500px;
margin:auto;
}

input{
padding:16px;
border-radius:12px;
border:none;
background:#1d212b;
color:white;
font-size:16px;
}

input:focus{
outline:2px solid #ffbf00;
}

button{
padding:16px;
border:none;
border-radius:12px;
background:#ffbf00;
font-size:17px;
font-weight:700;
cursor:pointer;
transition:.2s;
}

button:hover{
transform:translateY(-2px);
}

#waitlist-message{
margin-top:10px;
font-weight:600;
}

.features{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
gap:20px;
margin-top:70px;
}

.card{
background:#1a1e26;
padding:25px;
border-radius:18px;
}

.card h3{
margin-bottom:10px;
}

.card p{
opacity:.75;
line-height:1.6;
}

.footer{
margin-top:70px;
text-align:center;
opacity:.75;
line-height:1.8;
}

strong{
color:#ffbf00;
}

@media(max-width:700px){

.logo{
font-size:42px;
}

h1{
font-size:34px;
}

.subtitle{
font-size:16px;
}

}
</style>

</head>

<body>

<div class="container">

<section class="hero">

<div class="logo">paneacult</div>

<div class="badge">
🎬 Apertura iscrizioni • 1 Settembre 2026
</div>

<h1>
La casa per chi ama<br>
il cinema e le serie TV.
</h1>

<p class="subtitle">
Paneacult è un progetto indipendente nato per chi vive film e serie come una passione.
Entra nella lista d'attesa e sarai tra i primi a ricevere l'accesso il giorno del lancio.
</p>

<form id="waitlist-form">

<input
id="waitlist-name"
type="text"
placeholder="Il tuo nome"
required>

<input
id="waitlist-email"
type="email"
placeholder="La tua email"
required>

<button type="submit">
🚀 Entra nella lista d'attesa
</button>

<p id="waitlist-message"></p>

</form>

</section>

<section class="features">

<div class="card">
<h3>🎞️ Diario</h3>
<p>Tieni traccia di tutti i film e le serie TV che guardi.</p>
</div>

<div class="card">
<h3>⭐ Voti</h3>
<p>Assegna un voto ai tuoi titoli preferiti e crea il tuo archivio.</p>
</div>

<div class="card">
<h3>📝 Recensioni</h3>
<p>Scrivi le tue opinioni e rileggile ogni volta che vuoi.</p>
</div>

<div class="card">
<h3>📚 Watchlist</h3>
<p>Salva tutto quello che vorrai vedere in futuro.</p>
</div>

<div class="card">
<h3>📊 Statistiche e tempo visione</h3>
<p>Osserva il tuo percorso da appassionato.</p>
</div>

<div class="card">
<h3>🚀 È solo l'inizio</h3>
<p>Paneacult crescerà con aggiornamenti continui e grazie ai suggerimenti della community.</p>
</div>

</section>

<div class="footer">

<p>
<strong>Paneacult</strong> nasce da una semplice idea:
creare il posto che ogni appassionato di cinema e serie TV avrebbe sempre voluto.
</p>

<p style="margin-top:20px;">
Ci vediamo il <strong>1° settembre 2026.</strong> 🍿
</p>

</div>

</div>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="js/supabase.js"></script>
<script src="js/waitlist.js"></script>

</body>
</html>
