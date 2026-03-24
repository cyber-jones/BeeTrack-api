import { Schema, model, Document } from "mongoose";

export interface IMaintenanceRecord extends Document {
  vehicleId: string;
  description: string;
  status: "open" | "in_progress" | "resolved";
  createdBy: string;
  scheduledAt?: Date;
  resolvedAt?: Date;
  organizationId?: string;
}

const maintenanceSchema = new Schema<IMaintenanceRecord>(
  {
    vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["open", "in_progress", "resolved"], default: "open" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    scheduledAt: Date,
    resolvedAt: Date,
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization" }
  },
  { timestamps: true }
);

export default model<IMaintenanceRecord>("MaintenanceRecord", maintenanceSchema);