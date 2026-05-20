import { db } from "@/lib/db";

export async function GET() {
  const [rows] = await db.query(
    "SELECT idleaderboard, player_name, score, accuracy, created_at FROM leaderboard ORDER BY score DESC, accuracy DESC LIMIT 10"
  );

  return Response.json(rows);
}

export async function POST(request) {
  const body = await request.json();

  const { playerName, score, accuracy } = body;

  if (!playerName || score === undefined || accuracy === undefined) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  await db.query(
    "INSERT INTO leaderboard (player_name, score, accuracy) VALUES (?, ?, ?)",
    [playerName, score, accuracy]
  );

  return Response.json({ success: true });
}