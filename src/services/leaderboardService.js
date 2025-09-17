// src/services/leaderboardService.js
import Leaderboard from "../models/Leaderboard.js";
import { redisClient } from "../config/redis.js";
import { getIO } from "../config/socket.js"; // Correct import
import { logger } from "../config/logger.js";

// Daily TTL key
function getRedisKey(region, mode) {
  const date = new Date().toISOString().slice(0, 10);
  return `leaderboard:${region}:${mode}:${date}`;
}

export async function updateScore(userId, username, region, mode, score) {
  const key = getRedisKey(region, mode);

  let record = await Leaderboard.findOne({ user: userId, region, mode });
  if (record) {
    record.score = Math.max(record.score, score);
    await record.save();
  } else {
    record = await Leaderboard.create({ user: userId, region, mode, score });
  }

  await redisClient.zAdd(key, [{ score, value: username }]);

  const ttl = await redisClient.ttl(key);
  if (ttl === -1) {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const seconds = Math.floor((midnight - now) / 1000);
    await redisClient.expire(key, seconds);
  }

  // Get the Socket.IO instance and emit update
  const io = getIO();
  const topN = await getTopN(region, mode, 10);
  const room = `leaderboard:${region}:${mode}`; // Consistent room name
  io.to(room).emit("leaderboardUpdate", {
    region,
    mode,
    leaderboard: topN,
  });
  logger.info(`Leaderboard updated for ${room}, user: ${username}`);

  return record;
}

export async function getTopN(region, mode, limit) {
  const key = getRedisKey(region, mode);

  const cached = await redisClient.zRangeWithScores(key, -limit, -1, {
    REV: true,
  });
  if (cached.length)
    return cached.map((c) => ({ player: c.value, score: c.score }));

  const records = await Leaderboard.find({ region, mode })
    .populate("user", "username")
    .sort({ score: -1 })
    .limit(limit)
    .lean();

  return records.map((r) => ({ player: r.user.username, score: r.score }));
}
