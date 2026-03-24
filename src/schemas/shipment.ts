import { z } from "zod";

const coords = z.object({ lat: z.number(), lng: z.number() });

const location = z.object({
  address: z.string().optional(),
  coords: coords.optional()
});

export const createShipmentSchema = z.object({
  customerId: z.string().optional(),
  origin: location,
  destination: location,
  scheduledPickup: z.string().optional(),
  price: z.number().optional(),
  metadata: z.record(z.any(), z.any()).optional()
});

export const assignShipmentSchema = z.object({
  shipmentId: z.string(),
  vehicleId: z.string(),
  driverId: z.string().optional()
});