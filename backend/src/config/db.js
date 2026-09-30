import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongodInstance = null;

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (mongoUri && mongoUri.trim() !== '') {
      console.log('Connecting to provided MongoDB URI...');
      const conn = await mongoose.connect(mongoUri);
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return conn;
    }

    // Fallback to MongoMemoryServer for instant zero-config setup
    console.log('⚡ No MONGODB_URI detected. Initializing embedded MongoMemoryServer for SRM EEC SympoSphere...');
    mongodInstance = await MongoMemoryServer.create({
      instance: {
        dbName: 'eec_symposphere_db'
      }
    });

    const memoryUri = mongodInstance.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`✅ Embedded MongoDB Started & Connected: ${conn.connection.host}`);
    console.log(`📊 In-Memory Database URI: ${memoryUri}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongodInstance) {
      await mongodInstance.stop();
    }
  } catch (error) {
    console.error('Error closing DB:', error);
  }
};
