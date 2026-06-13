import mongoose from 'mongoose';

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable');
  }

  await mongoose.connect(uri, {
    dbName: 'admin-dashboard',
  });
  console.log('Connected to MongoDB');
}
