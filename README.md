# Leaderboard Netlify Function

This project contains a Netlify serverless function that connects to a Postgres database (e.g., Netlify Postgres / Neon) and exposes a simple leaderboard API.

Function

- `netlify/functions/leaderboard.mjs` — GET and POST endpoints.
  - GET `/.../leaderboard` returns all rows ordered by `score` desc.
  - GET `/.../leaderboard?email=you@example.com` returns that row.
  - POST `/.../leaderboard` accepts JSON `{ "email": "you@example.com", "score": 123 }` and upserts.

Notes

- This function uses `@netlify/neon` which reads the `DATABASE_URL` from Netlify environment variables.
- Create the `leaderboard` table by running the SQL in `migrations/create_leaderboard_table.sql` against your database, or the function will create it automatically on first POST.

Local testing

1. Install dependencies:

```powershell
npm install
```

2. Install Netlify CLI (if needed):

```powershell
npm install -g netlify-cli
```

3. Create a `.env` file with `DATABASE_URL` (or set the env var in your shell), then run:

```powershell
netlify dev
```

On Netlify, set `DATABASE_URL` in Site > Settings > Environment variables.
