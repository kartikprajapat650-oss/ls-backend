import mongoose, { Document, Schema } from 'mongoose';

export interface IPermission extends Document {
  key: string;
  name: string;
  description: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PermissionSchema = new Schema<IPermission>(
  {
    key: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Permission || mongoose.model<IPermission>('Permission', PermissionSchema);
