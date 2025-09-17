// src/controllers/leaderboardController.js
import { updateScore, getTopN } from "../services/leaderboardService.js";
import { getIO } from "../config/socket.js";
import { REGIONS, MODES } from "../constants/game.js";

/**
 * POST /leaderboard/score
 * Updates user score in DB + Redis and emits leaderboard update via Socket.IO
 */
export async function postScore(req, res) {
  const { region, mode, score } = req.body;

  if (!REGIONS.includes(region))
    return res.status(400).json({ error: "Invalid region" });
  if (!MODES.includes(mode))
    return res.status(400).json({ error: "Invalid mode" });
  if (typeof score !== "number" || score <= 0)
    return res.status(400).json({ error: "Invalid score" });

  // Update DB + Redis and let the service handle the Socket.IO emit
  const record = await updateScore(
    req.user.id,
    req.user.username,
    region,
    mode,
    score
  );

  // The Socket.IO emit is now handled by the updateScore service function.
  // The client will receive the update automatically.

  res.status(200).json({ message: "Score updated", record });
}

/**
 * GET /leaderboard/:region/:mode?limit=10
 * Returns top N leaderboard (Redis first, fallback to MongoDB)
 */
export async function getLeaderboard(req, res) {
  const { region, mode } = req.params;
  const limit = Number(req.query.limit || 10);

  if (!REGIONS.includes(region))
    return res.status(400).json({ error: "Invalid region" });
  if (!MODES.includes(mode))
    return res.status(400).json({ error: "Invalid mode" });

  const leaderboard = await getTopN(region, mode, limit);
  res.status(200).json({ leaderboard });
}
