import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import cors from 'cors';
import urlRoutes from "./routes/url.routes";
import pool from './config/db';
import statsRoutes from "./routes/stats.routes";
import { rateLimiter } from './middleware/rateLimiter';

const app = express();

console.log("Running build version:", new Date().toISOString());
// ✅ CORS — add your frontend Railway URL here once deployed
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://url-shortener-production-7137.up.railway.app',
    'https://url-shorten-production-ddfa.up.railway.app',
  ],
  methods: ['GET', 'POST'],
}));

// ✅ Single express.json()
app.use(express.json());

// ✅ Trust proxy once
app.set("trust proxy", 1);
// ✅ Rate limiter once globally
app.use(rateLimiter);
// ✅ Routes in correct order
app.use("/", urlRoutes);
app.use("/stats", statsRoutes);

// ✅ DB connection test
(async () => {
  const res = await pool.query('SELECT NOW()');
  console.log("✅ DB connected:", res.rows);
})();

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});