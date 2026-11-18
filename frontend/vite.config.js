import { defineConfig } from "vite";

// Only used by `npm run dev`: forwards /api calls to a backend on your machine.
// In Docker, nginx does this job instead (see nginx.conf).
export default defineConfig({
  server: { proxy: { "/api": "http://localhost:3000" } },
});
