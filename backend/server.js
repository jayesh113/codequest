import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import apiRouter from './routes/api.js';
import { runFullSeed } from './seed/seedData.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads folder
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Serve frontend public folder
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
app.use(express.static(publicDir));

// API Routes
app.use('/api', apiRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    platform: 'CodeQuest',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// Fallback to index.html for SPA routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  const indexPath = path.join(publicDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send('<h1>CodeQuest API Server Running on Port ' + PORT + '</h1><p>Frontend assets are being built.</p>');
  }
});

// Boot server
const startServer = async () => {
  await connectDB();
  await runFullSeed();

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 CodeQuest Web Platform is LIVE on http://localhost:${PORT}`);
    console.log(`📡 API Endpoints available at http://localhost:${PORT}/api`);
    console.log(`=======================================================`);
  });
};

if (!process.env.VERCEL) {
  startServer().catch(err => {
    console.error('Failed to start CodeQuest server:', err);
  });
} else {
  // Pre-warm DB on serverless invocation
  connectDB().then(() => runFullSeed()).catch(console.error);
}

export default app;