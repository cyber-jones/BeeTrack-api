import { Schema, model, Document } from "mongoose";

export interface IRefreshToken extends Document {
  token: string;
  userId: string;
  jti: string;
  revoked?: boolean;
  expiresAt: Date;
  createdByIp?: string;
  createdAt: Date;
}

const rtSchema = new Schema<IRefreshToken>(
  {
    token: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    jti: { type: String, required: true },
    revoked: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
    createdByIp: String
  },
  { timestamps: true }
);

rtSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default model<IRefreshToken>("RefreshToken", rtSchema);