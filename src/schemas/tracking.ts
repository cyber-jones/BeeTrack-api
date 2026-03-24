import { z } from "zod";

export const trackingEventSchema = z.object({
  vehicleId: z.string(),
  driverId: z.string().optional(),
  shipmentId: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  speed: z.number().optional(),
  heading: z.number().optional(),
  accuracy: z.number().optional(),
  battery: z.number().optional(),
  ts: z.string().optional()
});

export const trackingBatchSchema = z.array(trackingEventSchema).min(1);