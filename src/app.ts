// src/app.ts

import express from "express";
import dotenv from "dotenv";
import urlRoutes from "./routes/url.routes";
import pool  from './config/db';
import { redirectUrl } from "./controllers/url.controller";
import statsRoutes from "./routes/stats.routes";
import rateLimit from "express-rate-limit";


dotenv.config();

const app = express();

app.use(express.json());
app.use("/", urlRoutes);
app.get("/:code", redirectUrl);
app.use("/stats", statsRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on ${process.env.PORT || 3000}`);
});

// simple test query
(async () => {
  const res = await pool.query('SELECT NOW()');
  console.log(res.rows);
})();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
});

app.use(limiter);