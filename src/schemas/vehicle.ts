import { z } from "zod";

export const createVehicleSchema = z.object({
  plateNumber: z.string().min(1),
  vin: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.number().int().optional(),
  capacity: z.number().optional(),
  status: z.enum(["active", "inactive", "maintenance"]).optional()
});