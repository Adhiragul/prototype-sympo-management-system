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

dotenv.config();

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

// Manual Seed Trigger Endpoint (Convenient for demo reset)
app.post('/api/seed', async (req, res) => {
  try {
    await seedDatabase();
    res.json({ success: true, message: 'Database reseeded successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Global Error Handler
app.use(errorHandler);

// Start Server after connecting to Database
const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database is empty
    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
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
