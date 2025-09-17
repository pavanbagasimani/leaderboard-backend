import { Router } from "express";
import { REGIONS, MODES } from "../constants/game.js";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({ regions: REGIONS, modes: MODES });
});

export default router;
