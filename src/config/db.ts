import mongoose from "mongoose";
import logger from "../utils/logger";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/beetrack";

export default async function connectDB() {
  mongoose.set("strictQuery", false);
  await mongoose.connect(MONGO_URI);
  logger.info("Connected to MongoDB");
}