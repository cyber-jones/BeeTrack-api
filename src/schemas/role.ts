import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string().min(1),
  permissions: z.array(z.string()).optional()
});

export const updateRoleSchema = z.object({
  permissions: z.array(z.string()).optional()
});