import { Schema, model, Document } from "mongoose";

export interface IRole extends Document {
  name: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true, unique: true },
    permissions: { type: [String], default: [] }
  },
  { timestamps: true }
);

export default model<IRole>("Role", roleSchema);