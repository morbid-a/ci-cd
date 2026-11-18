// HTTP API: POST /api/register, POST /api/login, GET /api/health.
import express from "express";
import { AuthError, hashPassword, normalize, validatePassword, validateUsername, verifyPassword } from "./auth.js";
import { initDb, pool } from "./db.js";

const app = express();
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.post("/api/register", async (req, res, next) => {
  try {
    const username = normalize(req.body?.username);
    const password = req.body?.password;
    validateUsername(username);
    validatePassword(password);
    const result = await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [username, await hashPassword(password)],
    );
    if (result.rowCount === 0) throw new AuthError("Username already taken", 409);
    res.status(201).json({ username });
  } catch (err) {
    next(err);
  }
});

app.post("/api/login", async (req, res, next) => {
  try {
    const username = normalize(req.body?.username);
    const password = String(req.body?.password ?? "");
    const { rows } = await pool.query("SELECT password_hash FROM users WHERE username = $1", [username]);
    if (rows.length && (await verifyPassword(password, rows[0].password_hash))) {
      return res.json({ username });
    }
    throw new AuthError("Invalid username or password", 401);
  } catch (err) {
    next(err);
  }
});

app.use((err, _req, res, _next) => {
  if (err instanceof AuthError) return res.status(err.status).json({ error: err.message });
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const port = Number(process.env.PORT || 3000);
await initDb();
app.listen(port, "0.0.0.0", () => console.log(`Backend listening on port ${port}`));
