import { Request, Response, NextFunction } from "express";

export function permit(...allowed: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.auth?.role;
    if (!role) return res.status(401).json({ message: "Unauthorized" });
    if (!allowed.includes(role)) return res.status(403).json({ message: "Forbidden" });
    next();
  };
}