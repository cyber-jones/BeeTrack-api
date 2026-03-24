import { Schema, model, Document } from "mongoose";

export interface ITrackingEvent extends Document {
  vehicleId: string;
  driverId?: string;
  shipmentId?: string;
  location: { type: "Point"; coordinates: [number, number] };
  speed?: number;
  heading?: number;
  accuracy?: number;
  battery?: number;
  ts: Date;
  organizationId?: string;
}

const trackingEventSchema = new Schema<ITrackingEvent>(
  {
    vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    driverId: { type: Schema.Types.ObjectId, ref: "User" },
    shipmentId: { type: Schema.Types.ObjectId, ref: "Shipment" },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true } // [lng, lat]
    },
    speed: Number,
    heading: Number,
    accuracy: Number,
    battery: Number,
    ts: { type: Date, required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization" }
  },
  { timestamps: true }
);

trackingEventSchema.index({ location: "2dsphere" });

export default model<ITrackingEvent>("TrackingEvent", trackingEventSchema);