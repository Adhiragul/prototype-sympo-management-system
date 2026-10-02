import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import exportRoutes from './routes/exportRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { seedDatabase } from './utils/seeder.js';
import Event from './models/Event.js';
import { shouldAutoSeed } from './config/seedPolicy.js';

dotenv.config();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be set to a random value of at least 32 characters.');
}

const app = express();
const PORT = process.env.PORT || 5000;

// Core Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check & Root Info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    institution: 'SRM Easwari Engineering College (Autonomous)',
    service: 'SRM EEC SympoSphere API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/stats', statsRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Server after connecting to Database
const startServer = async () => {
  try {
    await connectDB();

    // Seed demo data only in the temporary in-memory database.
    const eventCount = await Event.countDocuments();
    if (shouldAutoSeed({ mongoUri: process.env.MONGODB_URI, eventCount })) {
      console.log('📦 Database is empty. Auto-seeding SRM EEC initial symposiums & demo users...');
      await seedDatabase();
    }

    app.listen(PORT, () => {
      console.log(`🚀 SRM EEC SympoSphere Backend running at http://localhost:${PORT}`);
      console.log(`🏫 Institution: SRM Easwari Engineering College (Autonomous)`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
