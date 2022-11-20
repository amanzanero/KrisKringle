import pino from "pino";

export const logger = pino({
  name: "trpc",
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
});
