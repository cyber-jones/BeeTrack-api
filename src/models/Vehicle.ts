import { Schema, model, Document } from "mongoose";

export interface IVehicle extends Document {
  plateNumber: string;
  vin?: string;
  make?: string;
  model?: string;
  year?: number;
  capacity?: number;
  status?: "active" | "inactive" | "maintenance";
  organizationId?: string;
  currentDriverId?: string;
  lastSeenAt?: Date;
}

const vehicleSchema = new Schema<IVehicle>(
  {
    plateNumber: { type: String, required: true, unique: true },
    vin: String,
    make: String,
    model: String,
    year: Number,
    capacity: Number,
    status: { type: String, default: "active" },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
    currentDriverId: { type: Schema.Types.ObjectId, ref: "User" },
    lastSeenAt: Date
  },
  { timestamps: true }
);

export default model<IVehicle>("Vehicle", vehicleSchema);