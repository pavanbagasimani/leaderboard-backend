import winston from "winston";

const logFormat = winston.format.printf(
  ({ level, message, timestamp }) =>
    `[${timestamp}] ${level.toUpperCase()}: ${message}`
);

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(winston.format.timestamp(), logFormat),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});
