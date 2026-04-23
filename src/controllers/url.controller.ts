// src/controllers/url.controller.ts

import { Request, Response } from "express";
import { logClick, createShortUrl } from "../services/url.service";
import pool from "../config/db";
import redisClient from "../config/redis";

// ✅ Define params type
interface UrlParams {
  code: string;
}

export const shortenUrl = async (req: Request, res: Response) => {
  console.log("👉 Request received:", req.body);

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const result = await createShortUrl(url);

    console.log("✅ Short URL created:", result);

    return res.json(result);
  } catch (err: any) {
    console.error("🔥 FULL ERROR:", err);
    return res.status(500).json({
      error: "Server error",
      message: err?.message || err,
    });
  }
};

export const redirectUrl = async (
  req: Request<UrlParams>, // ✅ FIX HERE
  res: Response
) => {
  try {
    const shortCode = req.params.code; // ✅ now fully typed

    // 🔥 STEP 1: CHECK CACHE
    const cached = await redisClient.get(shortCode);

    if (cached) {
      console.log("⚡ Cache HIT:", shortCode);

      logClick(shortCode); // non-blocking

      return res.redirect(cached);
    }

    console.log("❄️ Cache MISS:", shortCode);

    // 🔥 STEP 2: FETCH FROM DB
    const result = await pool.query(
      "SELECT original_url FROM urls WHERE short_code = $1",
      [shortCode]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("URL not found");
    }

    const originalUrl = result.rows[0].original_url;

    // 🔥 STEP 3: STORE IN CACHE
    await redisClient.set(shortCode, originalUrl, {
      EX: 3600,
    });

    logClick(shortCode); // non-blocking

    return res.redirect(originalUrl);

  } catch (err) {
    console.error("🔥 Redirect Error:", err);
    return res.status(500).send("Server error");
  }
};