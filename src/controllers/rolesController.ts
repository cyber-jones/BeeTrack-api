import { Request, Response, NextFunction } from "express";
import Role from "../models/Role";

/**
 * Role & permission basic management for UI
 */
export async function createRole(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, permissions } = req.body;
    const r = await Role.create({ name, permissions: permissions || [] });
    res.status(201).json(r);
  } catch (err) {
    next(err);
  }
}

export async function listRoles(req: Request, res: Response, next: NextFunction) {
  try {
    const list = await Role.find().limit(200);
    res.json(list);
  } catch (err) {
    next(err);
  }
}

export async function updateRole(req: Request, res: Response, next: NextFunction) {
  try {
    const updates = req.body;
    const role = await Role.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!role) return res.status(404).json({ message: "Not found" });
    res.json(role);
  } catch (err) {
    next(err);
  }
}

export async function deleteRole(req: Request, res: Response, next: NextFunction) {
  try {
    await Role.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}