import { neon } from "@netlify/neon";

export default async (request, context) => {
  const sql = neon();

  if (request.method === "POST") {
    const body = await request.json().catch(() => ({}));
    const name = body.name ?? "Anonymous";

    await sql(`
      CREATE TABLE IF NOT EXISTS guests (
        email TEXT PRIMARY KEY,
        score NUMERIC NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await sql`INSERT INTO guests (email, score) VALUES (${email}, ${score});`;

    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (request.method === "GET") {
    const rows = await sql`SELECT email, score, created_at FROM guests ORDER BY created_at DESC LIMIT 50;`;
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Method not allowed", { status: 405 });
};
