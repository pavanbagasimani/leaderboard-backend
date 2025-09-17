import { logger } from "../config/logger.js";

export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || "Internal server error";
  logger.error(`${req.method} ${req.url} - ${message}`);
  res.status(status).json({ error: message });
}
