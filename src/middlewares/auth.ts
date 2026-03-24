import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
// import RefreshToken from "../models/RefreshToken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

/**
 * Basic access token guard. Attaches req.auth (sub, role, org).
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || req.cookies["access_token"];
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.auth = { sub: payload.sub, role: payload.role, org: payload.org };
    const user = await User.findById(payload.sub).lean();
    if (!user) return res.status(401).json({ message: "Invalid token (user not found)" });
    req.auth.org = user.organizationId?.toString();
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

/**
 * Optional middleware to allow either system-level or user-level access; used where both are allowed.
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || req.cookies["access_token"];
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
  if (!token) return next();
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.auth = { sub: payload.sub, role: payload.role, org: payload.org };
  } catch {
    // ignore
  }
  next();
}