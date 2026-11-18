// Talks to the backend. All validation and hashing now happen on the server.
export class AuthError extends Error {}

async function post(path, body) {
  const res = await fetch(`/api/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new AuthError(data.error || "Something went wrong");
  return data;
}

export const register = (username, password) => post("register", { username, password });
export const login = (username, password) => post("login", { username, password });
