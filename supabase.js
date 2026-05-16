const supabaseUrl = "https://czvtirkuyhcilmzbwysf.supabase.co/rest/v1/";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6dnRpcmt1eWhjaWxtemJ3eXNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczOTM1NjIsImV4cCI6MjA5Mjk2OTU2Mn0.v--ZBxJyMAIpb1bWbN6J3DUDi5FfcoOrhKccwRyuEvw";

const supabaseClient = supabase.createClient(
  supabaseUrl,
  supabaseKey
);
