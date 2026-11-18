// Database layer: a Postgres connection pool and the users table.
import pg from "pg";

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || "postgres://auth:auth@localhost:5432/auth",
});

// The database container may still be starting, so retry for a while.
export async function initDb(retries = 30) {
  for (let attempt = 1; ; attempt++) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          username      TEXT PRIMARY KEY,
          password_hash TEXT NOT NULL
        )`);
      return;
    } catch (err) {
      if (attempt >= retries) throw err;
      console.log(`Database not ready (attempt ${attempt}/${retries}): ${err.message}`);
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}
