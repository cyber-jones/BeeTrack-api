import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export default function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error({ err, path: req.path }, "Unhandled error");
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal server error" });
}