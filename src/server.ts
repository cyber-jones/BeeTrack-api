import dotenv from "dotenv";
dotenv.config();
import http from "http";
import app from "./app";
import connectDB from "./config/db";
import logger from "./utils/logger";
import { initSocket } from "./socket";

const PORT = Number(process.env.PORT || 4000);

async function start() {
  await connectDB();
  const server = http.createServer(app);
  initSocket(server);

  server.listen(PORT, () => {
    logger.info({ port: PORT }, `Server listening`);
  });

  process.on("SIGTERM", () => {
    logger.info("SIGTERM received, shutting down gracefully");
    server.close(() => {
      logger.info("HTTP server closed");
      process.exit(0);
    });
  });
}

start().catch((err) => {
  logger.error({ err }, "Failed to start server");
  process.exit(1);
});