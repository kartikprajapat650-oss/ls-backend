import mongoose, { Document, Schema } from 'mongoose';

export interface IContentPage extends Document {
  slug: string;
  title: string;
  body: string;
  updatedBy: string;
  updatedAt: Date;
}

const ContentPageSchema = new Schema<IContentPage>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    updatedBy: { type: String, default: 'system' },
  },
  { timestamps: true }
);

export default mongoose.models.ContentPage || mongoose.model<IContentPage>('ContentPage', ContentPageSchema);
