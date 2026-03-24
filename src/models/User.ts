import { Schema, model, Document } from "mongoose";

export type Role =
  | "superadmin"
  | "admin"
  | "dispatcher"
  | "driver"
  | "customer"
  | "fleet_manager";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  organizationId?: string;
  phone?: string;
  isActive: boolean;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["superadmin", "admin", "dispatcher", "driver", "customer", "fleet_manager"], default: "customer" },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
    phone: String,
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default model<IUser>("User", userSchema);