import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import http from "http";
import { connectDB } from "./config/db.js";
import "./config/redis.js";
import authRoutes from "./routes/authRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import configRoutes from "./routes/configRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { initSocket } from "./config/socket.js";
import { logger } from "./config/logger.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/config", configRoutes);

app.use(errorHandler);

await connectDB();

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
export const io = initSocket(server); // make io available globally for services

server.listen(PORT, () =>
  logger.info(`[Server] Running on http://localhost:${PORT}`)
);
