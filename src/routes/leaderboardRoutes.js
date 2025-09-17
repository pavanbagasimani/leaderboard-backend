import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  postScore,
  getLeaderboard,
} from "../controllers/leaderboardController.js";

const router = Router();

// Update score (auth required)
router.post("/score", authenticate, asyncHandler(postScore));

// Get leaderboard (auth required)
router.get("/:region/:mode", authenticate, asyncHandler(getLeaderboard));

export default router;
