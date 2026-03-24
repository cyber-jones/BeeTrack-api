import { Schema, model, Document } from "mongoose";

export interface IOrganization extends Document {
  name: string;
  settings?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const orgSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true, unique: true },
    settings: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

export default model<IOrganization>("Organization", orgSchema);