import { createClient } from "redis";
import { logger } from "./logger.js";

export const redisClient = createClient({ url: process.env.REDIS_URL });

redisClient.on("error", (err) => logger.error(`[Redis] ${err.message}`));

await redisClient.connect();
logger.info("Redis connected");
