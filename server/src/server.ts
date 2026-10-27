import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { storage } from './database/storage.js';
import { redisService } from './services/redis.service.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static uploads directory
const uploadsDir = path.resolve(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Mount REST API
app.use('/api', apiRoutes);

// Central error handler
app.use(errorHandler);

// Start server and initialize database
async function startServer() {
  try {
    console.log('----------------------------------------------------');
    console.log('🚀 TalentMatch AI - Intelligent Resume Screening API');
    console.log('----------------------------------------------------');

    // Run DB schema init and seed check
    await storage.initDatabaseSchemaAndSeed();

    // Check Redis
    const redisStatus = redisService.isReady() ? 'Connected (Redis)' : 'In-Memory Fallback Active';
    console.log(`[Cache Status] ${redisStatus}`);

    app.listen(PORT, () => {
      console.log(`✅ Server listening on http://localhost:${PORT}`);
      console.log(`📡 API Endpoints available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
