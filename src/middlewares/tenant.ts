import { Request, Response, NextFunction } from "express";

/**
 * Sets req.tenant.organizationId.
 * If the request is authenticated, use req.auth.org.
 * Otherwise allow a header x-organization-id for system-level calls (validate as needed).
 */
export function tenantMiddleware(req: Request, _res: Response, next: NextFunction) {
  if (req.auth?.org) {
    req.tenant = { organizationId: req.auth.org };
  } else if (req.headers["x-organization-id"]) {
    req.tenant = { organizationId: String(req.headers["x-organization-id"]) };
  } else {
    req.tenant = { organizationId: undefined };
  }
  next();
}