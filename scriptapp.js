const supabaseUrl = "TUA_URL";
const supabaseKey = "TUA_KEY";

const supabaseClient = supabase.createClient(
  supabaseUrl,
  supabaseKey
);
const loginBtn = document.querySelector(".btn-yellow");

loginBtn?.addEventListener("click", async () => {

  const email =
    document.querySelector('input[type="email"]').value;

  const password =
    document.querySelector('input[type="password"]').value;

  const { error } =
    await supabaseClient.auth.signInWithPassword({

      email,
      password

    });

  if(error){

    alert(error.message);

  } else {

    window.location.href = "index.html";

  }

});

const registerBtn =
  document.querySelector(".btn-outline");

registerBtn?.addEventListener("click", async () => {

  const email =
    document.querySelector('input[type="email"]').value;

  const password =
    document.querySelector('input[type="password"]').value;

  const { error } =
    await supabaseClient.auth.signUp({

      email,
      password

    });

  if(error){

    alert(error.message);

  } else {

    alert("Controlla la tua email ✨");

  }

});


supabaseClient.auth.getSession()
.then(({ data }) => {

  if(data.session){

    console.log("utente loggato");

  }

});



