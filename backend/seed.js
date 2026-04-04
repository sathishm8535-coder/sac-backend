import dotenv from 'dotenv';
import connectDB from './config/db.js';
import mongoose from 'mongoose';
import User from './models/User.js';

dotenv.config();

const seed = async () => {
  await connectDB();

  // Drop any old non-sparse unique indexes on email or username that would block mixed-role inserts
  try {
    const col = mongoose.connection.db.collection('users');
    const indexes = await col.indexes();
    for (const idx of indexes) {
      const field = Object.keys(idx.key)[0];
      if (['email', 'username'].includes(field) && !idx.sparse) {
        await col.dropIndex(idx.name);
        console.log(`🗑️  Dropped non-sparse index: ${idx.name}`);
      }
    }
  } catch (e) {
    console.log('Index cleanup skipped:', e.message);
  }

  const defaults = [
    { username: 'adminsac', password: 'admin123', role: 'admin' },
    { username: 'staffsac', password: 'staff123', role: 'staff' }
  ];

  for (const data of defaults) {
    const exists = await User.findOne({ username: data.username });
    if (!exists) {
      await User.create(data);
      console.log(`✅ Created: ${data.username} (${data.role})`);
    } else {
      console.log(`⏭️  Already exists: ${data.username}`);
    }
  }

  process.exit(0);
};

seed();
