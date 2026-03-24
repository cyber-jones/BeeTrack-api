import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import usersRoutes from "./routes/users";
import orgRoutes from "./routes/organizations";
import vehiclesRoutes from "./routes/vehicles";
import shipmentsRoutes from "./routes/shipments";
import trackingRoutes from "./routes/tracking";
import maintenanceRoutes from "./routes/maintenance";
import rolesRoutes from "./routes/roles";
import errorHandler from "./middlewares/errorHandler";

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(rateLimit({ windowMs: 60 * 1000, max: 300 }));
app.use(morgan("dev"));

app.get("/health", (_, res) => res.json({ status: "ok" }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/organizations", orgRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/vehicles", vehiclesRoutes);
app.use("/api/v1/shipments", shipmentsRoutes);
app.use("/api/v1/tracking", trackingRoutes);
app.use("/api/v1/maintenance", maintenanceRoutes);
app.use("/api/v1/roles", rolesRoutes);

app.use(errorHandler);

export default app;