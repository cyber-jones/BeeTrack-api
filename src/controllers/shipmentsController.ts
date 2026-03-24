import { Request, Response, NextFunction } from "express";
import Shipment from "../models/Shipment";
import { createShipmentSchema, assignShipmentSchema } from "../schemas/shipment";
import { distanceMatrix } from "../config/googleMaps";
import logger from "../utils/logger";

/**
 * Create shipment
 */
export async function createShipment(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createShipmentSchema.parse(req.body);
    const referenceNumber = `SHP-${Date.now().toString(36)}`;
    const shipment = await Shipment.create({
      referenceNumber,
      organizationId: req.tenant?.organizationId,
      customerId: parsed.customerId ?? req.auth?.sub,
      origin: parsed.origin,
      destination: parsed.destination,
      scheduledPickup: parsed.scheduledPickup ? new Date(parsed.scheduledPickup) : undefined,
      price: parsed.price,
      metadata: parsed.metadata
    });
    res.status(201).json(shipment);
  } catch (err) {
    next(err);
  }
}

/**
 * Assign shipment to vehicle/driver and compute ETA via Google Maps (if possible)
 */
export async function assignShipment(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = assignShipmentSchema.parse(req.body);
    const shipment = await Shipment.findById(parsed.shipmentId);
    if (!shipment) return res.status(404).json({ message: "Shipment not found" });

    shipment.assignedVehicleId = parsed.vehicleId;
    shipment.assignedDriverId = parsed.driverId;
    shipment.status = "assigned";

    // optional ETA via Google Distance Matrix if we have addresses
    try {
      if (shipment.origin?.address && shipment.destination?.address) {
        const dm = await distanceMatrix(shipment.origin.address, shipment.destination.address);
        const element = dm.rows?.[0]?.elements?.[0];
        if (element?.duration) {
          shipment.metadata = { ...(shipment.metadata || {}), eta_seconds: element.duration.value };
        }
      }
    } catch (err) {
      logger.warn({ err }, "Google Maps ETA failed");
    }

    await shipment.save();
    res.json(shipment);
  } catch (err) {
    next(err);
  }
}

export async function getShipment(req: Request, res: Response, next: NextFunction) {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) return res.status(404).json({ message: "Not found" });
    res.json(shipment);
  } catch (err) {
    next(err);
  }
}

export async function listShipments(req: Request, res: Response, next: NextFunction) {
  try {
    const q: any = {};
    if (req.tenant?.organizationId) q.organizationId = req.tenant.organizationId;
    const list = await Shipment.find(q).limit(200);
    res.json(list);
  } catch (err) {
    next(err);
  }
}

export async function updateShipment(req: Request, res: Response, next: NextFunction) {
  try {
    const updates = req.body;
    const shipment = await Shipment.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!shipment) return res.status(404).json({ message: "Not found" });
    res.json(shipment);
  } catch (err) {
    next(err);
  }
}

export async function deleteShipment(req: Request, res: Response, next: NextFunction) {
  try {
    await Shipment.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}