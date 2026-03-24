import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      auth?: { sub: string; role: string; org?: string };
      tenant?: { organizationId?: string };
    }
  }
}

export {};