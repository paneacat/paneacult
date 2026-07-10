<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Paneacult | Lista d'attesa</title>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">

<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
}

body{
background:#111;
color:white;
font-family:Poppins,sans-serif;
display:flex;
justify-content:center;
align-items:center;
min-height:100vh;
padding:20px;
}

.container{
max-width:650px;
text-align:center;
}

.logo{
font-size:52px;
font-weight:700;
margin-bottom:20px;
color:#ffbf00;
}

h1{
font-size:42px;
margin-bottom:15px;
}

p{
opacity:.8;
line-height:1.7;
margin-bottom:30px;
}

form{
display:flex;
flex-direction:column;
gap:15px;
}

input{
padding:16px;
border:none;
border-radius:12px;
font-size:16px;
background:#222;
color:white;
}

input:focus{
outline:2px solid #ffbf00;
}

button{
padding:16px;
border:none;
border-radius:12px;
background:#ffbf00;
color:#111;
font-size:18px;
font-weight:700;
cursor:pointer;
transition:.2s;
}

button:hover{
transform:translateY(-2px);
}

#waitlist-message{
margin-top:20px;
font-weight:600;
}

.small{
margin-top:40px;
font-size:14px;
opacity:.6;
}

</style>
</head>

<body>

<div class="container">

<div class="logo">paneacult</div>

<h1>Le iscrizioni aprono il 1° settembre 🎬</h1>

<p>
Paneacult sarà la casa degli amanti del cinema e delle serie TV.
Lascia il tuo nome e la tua email per entrare nella lista d'attesa.
Sarai tra i primi a ricevere l'accesso quando apriremo le porte.
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

<div class="small">
Ci vediamo il <strong>1° settembre 2026</strong> 🍿
</div>

</div>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>
<script src="js/supabase.js"></script>
<script src="js/waitlist.js"></script>

</body>
</html>
