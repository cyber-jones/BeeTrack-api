import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import RefreshToken from "../models/RefreshToken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || "15m";
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || "7d";

export function signAccessToken(payload: Record<string, any>) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRES });
}

export function signRefreshToken(payload: Record<string, any>) {
  const jti = uuidv4();
  return {
    token: jwt.sign({ ...payload, jti }, JWT_SECRET, { expiresIn: REFRESH_EXPIRES }),
    jti
  };
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as any;
}

/**
 * Utility that ensures a refresh token is valid and present in DB (not revoked).
 * Returns payload or null.
 */
export async function verifyRefreshTokenInDb(token: string) {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const record = await RefreshToken.findOne({ token, revoked: false });
    if (!record) return null;
    return payload;
  } catch {
    return null;
  }
}