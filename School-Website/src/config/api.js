// Single source of truth for where the backend lives.
//
// - Set VITE_API_BASE_URL at build time to point at your deployed API
//   (e.g. https://api.yourschool.com). This is required for a public
//   deployment - see .env.example.
// - If it's not set, dev mode falls back to http://localhost:3001 (the
//   default port server/index.js listens on) so local development keeps
//   working out of the box.
// - If it's not set and this is a production build, we fall back to ""
//   (same-origin relative requests), which works if the frontend and API
//   are served from the same domain (e.g. via a reverse proxy).
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? "http://localhost:3001" : "");
