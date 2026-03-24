import { Request, Response, NextFunction } from "express";
import Vehicle from "../models/Vehicle";
import { parsePagination } from "../utils/pagination";

/**
 * List vehicles with server-side search (q) and pagination
 * Query params: q, page, limit, sort
 * Response: { items, total, page, limit }
 */
export async function listVehicles(req: Request, res: Response, next: NextFunction) {
  try {
    const { q } = req.query;
    const tenantOrg = req.tenant?.organizationId;
    const { page, limit, skip, sort } = parsePagination(req.query);

    const baseFilter: any = {};
    if (tenantOrg) baseFilter.organizationId = tenantOrg;

    if (q && String(q).trim().length > 0) {
      const regex = new RegExp(String(q).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      baseFilter.$or = [
        { plateNumber: regex },
        { vin: regex },
        { make: regex },
        { model: regex }
      ];
    }

    const [total, items] = await Promise.all([
      Vehicle.countDocuments(baseFilter),
      Vehicle.find(baseFilter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
    ]);

    res.json({ items, total, page, limit });
  } catch (err) {
    next(err);
  }
}

/**
 * Other movement: keep create/get/update/delete methods as before
 */
export async function createVehicle(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.body;
    const vehicle = await Vehicle.create({ ...body, organizationId: req.tenant?.organizationId });
    res.status(201).json(vehicle);
  } catch (err) {
    next(err);
  }
}

export async function getVehicle(req: Request, res: Response, next: NextFunction) {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Not found" });
    res.json(vehicle);
  } catch (err) {
    next(err);
  }
}

export async function updateVehicle(req: Request, res: Response, next: NextFunction) {
  try {
    const updates = req.body;
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!vehicle) return res.status(404).json({ message: "Not found" });
    res.json(vehicle);
  } catch (err) {
    next(err);
  }
}

export async function deleteVehicle(req: Request, res: Response, next: NextFunction) {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}