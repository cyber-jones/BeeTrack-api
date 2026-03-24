import { Schema, model, Document } from "mongoose";

export interface IPermission extends Document {
  key: string;
  description?: string;
}

const permissionSchema = new Schema<IPermission>({
  key: { type: String, required: true, unique: true },
  description: String
});

export default model<IPermission>("Permission", permissionSchema);