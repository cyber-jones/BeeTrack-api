import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import logger from "./utils/logger";
import jwt from "jsonwebtoken";

let io: IOServer | null = null;

export function initSocket(server: HttpServer) {
  io = new IOServer(server, { cors: { origin: "*" } });

  const trackingNs = io.of("/tracking");

  trackingNs.use((socket, next) => {
    const token = (socket.handshake.auth && socket.handshake.auth.token) || socket.handshake.headers["authorization"];
    let raw = token;
    if (typeof raw === "string" && raw.startsWith("Bearer ")) raw = raw.split(" ")[1];
    try {
      const payload = jwt.verify(raw as string, process.env.JWT_SECRET || "secret") as any;
      (socket as any).auth = payload;
      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  trackingNs.on("connection", (socket) => {
    logger.info("Socket connected to /tracking: " + socket.id);

    socket.on("subscribeShipment", (shipmentId: string) => {
      socket.join(`shipment:${shipmentId}`);
    });

    socket.on("unsubscribeShipment", (shipmentId: string) => {
      socket.leave(`shipment:${shipmentId}`);
    });

    socket.on("disconnect", () => {
      logger.info("Socket disconnected: " + socket.id);
    });
  });
}

export function emitShipmentUpdate(shipmentId: string, payload: any) {
  if (!io) return;
  io.of("/tracking").to(`shipment:${shipmentId}`).emit("shipment:update", payload);
}