import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";

/**
 * List users within tenant organization (or all for superadmin)
 */
export async function listUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const query: any = {};
    if (req.tenant?.organizationId) query.organizationId = req.tenant.organizationId;
    const users = await User.find(query).limit(100);
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password, role, organizationId } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already exists" });
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash, role, organizationId: organizationId ?? req.tenant?.organizationId });
    res.status(201).json({ id: user._id, email: user.email });
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) return res.status(404).json({ message: "Not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}