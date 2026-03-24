import { z } from "zod";

export const createMaintenanceSchema = z.object({
  vehicleId: z.string(),
  description: z.string().min(1),
  scheduledAt: z.string().optional()
});

export const updateMaintenanceSchema = z.object({
  status: z.enum(["open", "in_progress", "resolved"]).optional(),
  resolvedAt: z.string().optional()
});