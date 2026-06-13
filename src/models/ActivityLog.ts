import mongoose, { Document, Schema } from 'mongoose';

export interface IActivityLog extends Document {
  user: mongoose.Types.ObjectId;
  email: string;
  action: string;
  target?: string;
  details?: string;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    email: { type: String, required: true },
    action: { type: String, required: true },
    target: { type: String },
    details: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
