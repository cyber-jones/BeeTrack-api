import { Request, Response, NextFunction } from "express";
import Organization from "../models/Organization";

/**
 * Create a new organization (superadmin or system)
 */
export async function createOrganization(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, settings } = req.body;
    const org = await Organization.create({ name, settings });
    res.status(201).json(org);
  } catch (err) {
    next(err);
  }
}

export async function listOrganizations(req: Request, res: Response, next: NextFunction) {
  try {
    const list = await Organization.find().limit(100);
    res.json(list);
  } catch (err) {
    next(err);
  }
}