import dotenv from 'dotenv';
import connectDB from './config/db.js';
import mongoose from 'mongoose';

dotenv.config();

const fixIndexes = async () => {
  await connectDB();
  const db = mongoose.connection.db;
  const collection = db.collection('users');

  try {
    await collection.dropIndex('email_1');
    console.log('✅ Dropped old email index');
  } catch (e) {
    console.log('⏭️  email index not found, skipping');
  }

  process.exit(0);
};

fixIndexes();
