import mongoose, { Document, Schema } from 'mongoose';

export interface ILoginHistory extends Document {
  user: mongoose.Types.ObjectId;
  email: string;
  loginAt: Date;
  logoutAt?: Date;
  device?: string;
  browser?: string;
  status: 'success' | 'failed';
}

const LoginHistorySchema = new Schema<ILoginHistory>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    email: { type: String, required: true },
    loginAt: { type: Date, default: Date.now },
    logoutAt: { type: Date },
    device: { type: String },
    browser: { type: String },
    status: { type: String, enum: ['success', 'failed'], default: 'success' },
  },
  { timestamps: true }
);

export default mongoose.models.LoginHistory || mongoose.model<ILoginHistory>('LoginHistory', LoginHistorySchema);
