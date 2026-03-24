import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import RefreshToken from "../models/RefreshToken";
import { signAccessToken, signRefreshToken, verifyRefreshTokenInDb } from "../utils/jwt";
import { registerSchema, loginSchema } from "../schemas/auth";
import logger from "../utils/logger";
import { ZodError } from "zod";

/**
 * Register - creates user and optionally associate to organization.
 */
export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = registerSchema.parse(req.body);
    const existing = await User.findOne({ email: parsed.email });
    if (existing) return res.status(409).json({ message: "Email already in use" });
    const passwordHash = await bcrypt.hash(parsed.password, 12);
    const user = await User.create({
      name: parsed.name,
      email: parsed.email,
      passwordHash,
      role: parsed.role ?? "customer",
      organizationId: parsed.organizationId
    });
    res.status(201).json({ id: user._id, email: user.email, role: user.role });
  } catch (err) {
    if (err instanceof ZodError) return res.status(400).json({ message: "Validation error", issues: err.issues });
    next(err);
  }
}

/**
 * Login - issues access and refresh tokens (persist refresh token record)
 */
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = loginSchema.parse(req.body);
    const user = await User.findOne({ email: parsed.email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(parsed.password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = signAccessToken({ sub: user._id.toString(), role: user.role, org: user.organizationId });
    const { token: refreshToken, jti } = signRefreshToken({ sub: user._id.toString(), role: user.role, org: user.organizationId });

    await RefreshToken.create({
      token: refreshToken,
      userId: user._id.toString(),
      jti,
      expiresAt: new Date(Date.now() + parseExpiryToMs(process.env.JWT_REFRESH_EXPIRES || "7d")),
      createdByIp: req.ip
    });

    // set httpOnly cookie for refresh token
    res.cookie("refresh_token", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" });
    res.json({ accessToken, expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m" });
  } catch (err) {
    next(err);
  }
}

/**
 * Refresh - exchange a valid refresh token for new tokens (rotate and revoke old)
 */
export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const rt = req.cookies["refresh_token"] || req.body.refreshToken;
    if (!rt) return res.status(401).json({ message: "Missing refresh token" });
    const payload = await verifyRefreshTokenInDb(rt);
    if (!payload) return res.status(401).json({ message: "Invalid refresh token" });

    // rotate
    const userId = payload.sub;
    const accessToken = signAccessToken({ sub: userId, role: payload.role, org: payload.org });
    const { token: newRefreshToken, jti } = signRefreshToken({ sub: userId, role: payload.role, org: payload.org });

    await RefreshToken.create({
      token: newRefreshToken,
      userId,
      jti,
      expiresAt: new Date(Date.now() + parseExpiryToMs(process.env.JWT_REFRESH_EXPIRES || "7d")),
      createdByIp: req.ip
    });

    // revoke old token(s) that match (set revoked)
    await RefreshToken.updateMany({ token: rt, revoked: false }, { $set: { revoked: true } });

    res.cookie("refresh_token", newRefreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" });
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
}

/**
 * Logout - revoke the presented refresh token
 */
export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const rt = req.cookies["refresh_token"] || req.body.refreshToken;
    if (!rt) return res.status(400).json({ message: "Missing refresh token" });
    await RefreshToken.updateMany({ token: rt }, { $set: { revoked: true } });
    res.clearCookie("refresh_token");
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

/**
 * Revoke all - revoke all refresh tokens for a user (logout all devices)
 */
export async function revokeAll(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.auth?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    await RefreshToken.updateMany({ userId }, { $set: { revoked: true } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

function parseExpiryToMs(exp: string) {
  const v = exp;
  const num = Number(v.slice(0, -1));
  const unit = v.slice(-1);
  switch (unit) {
    case "m":
      return num * 60 * 1000;
    case "h":
      return num * 60 * 60 * 1000;
    case "d":
      return num * 24 * 60 * 60 * 1000;
    default:
      return 7 * 24 * 60 * 60 * 1000;
  }
}