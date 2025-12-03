import { neon } from "@netlify/neon";

const sql = neon();

export default async function (request, context) {
  try {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method === "GET") {
      const url = new URL(request.url);
      const email = url.searchParams.get("email");

      if (email) {
        const rows = await sql`SELECT email, score FROM leaderboard WHERE email = ${email} LIMIT 1;`;
        return new Response(JSON.stringify({ success: true, data: rows[0] ?? null }), {
          status: 200,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }

      const rows = await sql`SELECT email, score FROM leaderboard ORDER BY score DESC;`;
      return new Response(JSON.stringify({ success: true, data: rows }), {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    if (request.method === "POST") {
      const body = await request.json().catch(() => ({}));
      const email = (body.email || "").toString().trim().toLowerCase();
      const rawScore = body.score;
      const score = Number.isFinite(Number(rawScore)) ? Math.trunc(Number(rawScore)) : null;

      if (!email) {
        return new Response(JSON.stringify({ success: false, error: "Missing or invalid email" }), { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
      }
      if (score === null) {
        return new Response(JSON.stringify({ success: false, error: "Missing or invalid score" }), { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
      }

      // Ensure table exists (idempotent)
      await sql(`
        CREATE TABLE IF NOT EXISTS leaderboard (
          email TEXT PRIMARY KEY,
          score INTEGER NOT NULL DEFAULT 0
        );
      `);

      // Upsert: insert or update score
      const rows = await sql`
        INSERT INTO leaderboard (email, score) VALUES (${email}, ${score})
        ON CONFLICT (email) DO UPDATE SET score = EXCLUDED.score
        RETURNING email, score;
      `;

      return new Response(JSON.stringify({ success: true, data: rows[0] }), {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), { status: 405, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
  } catch (err) {
    console.error("leaderboard function error:", err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
  }
}
