const supabaseUrl =
  "https://czvtirkuyhcilmzbwysf.supabase.co";

const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6dnRpcmt1eWhjaWxtemJ3eXNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczOTM1NjIsImV4cCI6MjA5Mjk2OTU2Mn0.v--ZBxJyMAIpb1bWbN6J3DUDi5FfcoOrhKccwRyuEvw";

const supabaseClient =
  supabase.createClient(
    supabaseUrl,
    supabaseKey
  );

document.addEventListener("DOMContentLoaded", async () => {
const {
  data: { session }
} = await supabaseClient.auth.getSession();

if(
  session &&
  window.location.pathname.includes("login")
){

  window.location.href =
    "/home.html";

  return;
}
  
  
  const supabaseUrl = "https://czvtirkuyhcilmzbwysf.supabase.co/rest/v1/";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6dnRpcmt1eWhjaWxtemJ3eXNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczOTM1NjIsImV4cCI6MjA5Mjk2OTU2Mn0.v--ZBxJyMAIpb1bWbN6J3DUDi5FfcoOrhKccwRyuEvw";

const supabaseClient = supabase.createClient(
  supabaseUrl,
  supabaseKey
);
