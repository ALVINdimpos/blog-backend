import { createLogger, format, transports } from "winston";

// Configure the Winston logger.
const logger = createLogger({
  level: "info", // Minimum log level to record
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  transports: [
    // Console transport
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
    // File transport
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log" }),
  ],
});

export default logger;
