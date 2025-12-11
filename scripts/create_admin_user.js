// Run with NODE_ENV variables set (SUPABASE_SERVICE_ROLE_KEY etc.)
const { createClient } = require("@supabase/supabase-js");
const bcrypt = require("bcryptjs");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key);

async function run() {
  const email = process.env.ADMIN_INITIAL_EMAIL;
  const password = process.env.ADMIN_INITIAL_PASSWORD;
  const password_hash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase.from("users").insert([
    { email, password_hash, role: "admin", name: "Owner" },
  ]);

  if (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
  console.log("Admin created:", data);
}

run();
