import { Request, Response, NextFunction } from "express";
import TrackingEvent from "../models/TrackingEvent";
import { trackingEventSchema, trackingBatchSchema } from "../schemas/tracking";
import { emitShipmentUpdate } from "../socket";

/**
 * Post single or batch tracking events
 */
export async function postEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.body;
    let events: any[] = [];
    if (Array.isArray(body)) {
      events = trackingBatchSchema.parse(body);
    } else {
      events = [trackingEventSchema.parse(body)];
    }

    const docs = events.map((e) => ({
      vehicleId: e.vehicleId,
      driverId: e.driverId,
      shipmentId: e.shipmentId,
      organizationId: req.tenant?.organizationId,
      location: { type: "Point", coordinates: [e.lng, e.lat] },
      speed: e.speed,
      heading: e.heading,
      accuracy: e.accuracy,
      battery: e.battery,
      ts: e.ts ? new Date(e.ts) : new Date()
    }));

    const inserted = await TrackingEvent.insertMany(docs);

    // Emit real-time updates per shipment channel if present
    for (const d of inserted) {
      if (d.shipmentId) {
        emitShipmentUpdate(d.shipmentId.toString(), {
          vehicleId: d.vehicleId,
          location: d.location,
          ts: d.ts
        });
      }
    }

    res.status(201).json({ count: inserted.length });
  } catch (err) {
    next(err);
  }
}

/**
 * Get history filterable by shipmentId or vehicleId
 */
export async function getHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const { shipmentId, vehicleId, limit = 100 } = req.query;
    const q: any = {};
    if (shipmentId) q.shipmentId = shipmentId;
    if (vehicleId) q.vehicleId = vehicleId;
    if (req.tenant?.organizationId) q.organizationId = req.tenant.organizationId;
    const events = await TrackingEvent.find(q).sort({ ts: -1 }).limit(Number(limit));
    res.json(events);
  } catch (err) {
    next(err);
  }
}