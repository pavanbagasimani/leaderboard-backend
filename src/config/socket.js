// src/config/socket.js
import { Server } from "socket.io";
import { authenticateSocket } from "../middleware/authSocket.js";
import { logger } from "./logger.js";
import { getTopN } from "../services/leaderboardService.js"; // Import the service

let io; // keep a reference

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    logger.info(
      `Client connected: ${socket.id} (user: ${
        socket.user?.username || "guest"
      })`
    );

    socket.on("joinLeaderboard", async ({ region, mode }) => {
      // Make function async
      const room = `leaderboard:${region}:${mode}`;
      socket.join(room);
      logger.info(`User ${socket.user?.username} joined room: ${room}`);

      // 👇 Send initial leaderboard data to the joining client
      const topPlayers = await getTopN(region, mode, 10);
      socket.emit("leaderboardUpdate", {
        region,
        mode,
        leaderboard: topPlayers,
      });
    });

    socket.on("disconnect", (reason) => {
      logger.info(`Client disconnected: ${socket.id} (reason: ${reason})`);
    });
  });

  return io;
}

// 👇 safe accessor for controllers
export function getIO() {
  if (!io) {
    throw new Error(
      "Socket.io not initialized! Call initSocket(server) first."
    );
  }
  return io;
}
