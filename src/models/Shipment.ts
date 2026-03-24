import { Schema, model, Document } from "mongoose";

export type ShipmentStatus =
  | "created"
  | "assigned"
  | "picked_up"
  | "in_transit"
  | "delivered"
  | "completed"
  | "canceled";

export interface ILocation {
  address?: string;
  coords?: { type: "Point"; coordinates: [number, number] };
}

export interface IShipment extends Document {
  referenceNumber: string;
  organizationId?: string;
  customerId: string;
  origin: ILocation;
  destination: ILocation;
  status: ShipmentStatus;
  assignedVehicleId?: string;
  assignedDriverId?: string;
  scheduledPickup?: Date;
  actualPickup?: Date;
  deliveredAt?: Date;
  price?: number;
  metadata?: Record<string, any>;
}

const locationSchema = new Schema(
  {
    address: String,
    coords: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], index: "2dsphere" }
    }
  },
  { _id: false }
);

const shipmentSchema = new Schema<IShipment>(
  {
    referenceNumber: { type: String, required: true, unique: true },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    origin: locationSchema,
    destination: locationSchema,
    status: { type: String, enum: ["created", "assigned", "picked_up", "in_transit", "delivered", "completed", "canceled"], default: "created" },
    assignedVehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle" },
    assignedDriverId: { type: Schema.Types.ObjectId, ref: "User" },
    scheduledPickup: Date,
    actualPickup: Date,
    deliveredAt: Date,
    price: Number,
    metadata: Schema.Types.Mixed
  },
  { timestamps: true }
);

export default model<IShipment>("Shipment", shipmentSchema);