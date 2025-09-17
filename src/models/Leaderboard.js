import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    score: { type: Number, required: true, default: 0 },
    region: { type: String, required: true },
    mode: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Leaderboard", leaderboardSchema);
