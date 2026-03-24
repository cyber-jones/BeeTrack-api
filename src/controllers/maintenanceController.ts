import { Request, Response, NextFunction } from "express";
import MaintenanceRecord from "../models/MaintenanceRecord";

/**
 * Create maintenance record
 */
export async function createMaintenance(req: Request, res: Response, next: NextFunction) {
  try {
    const { vehicleId, description, scheduledAt } = req.body;
    const rec = await MaintenanceRecord.create({
      vehicleId,
      description,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      createdBy: req.auth?.sub,
      organizationId: req.tenant?.organizationId
    });
    res.status(201).json(rec);
  } catch (err) {
    next(err);
  }
}

export async function listMaintenance(req: Request, res: Response, next: NextFunction) {
  try {
    const q: any = {};
    if (req.tenant?.organizationId) q.organizationId = req.tenant.organizationId;
    const list = await MaintenanceRecord.find(q).limit(200);
    res.json(list);
  } catch (err) {
    next(err);
  }
}

export async function updateMaintenance(req: Request, res: Response, next: NextFunction) {
  try {
    const updates = req.body;
    if (updates.resolvedAt) updates.resolvedAt = new Date(updates.resolvedAt);
    const rec = await MaintenanceRecord.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!rec) return res.status(404).json({ message: "Not found" });
    res.json(rec);
  } catch (err) {
    next(err);
  }
}

export async function deleteMaintenance(req: Request, res: Response, next: NextFunction) {
  try {
    await MaintenanceRecord.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}