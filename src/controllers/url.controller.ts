// src/controllers/url.controller.ts

import { Request, Response } from "express";
import { createShortUrl, getOriginalUrl } from "../services/url.service";
import pool from "../config/db";
import redisClient from "../config/redis";

export const shortenUrl = async (req: Request, res: Response) => {
  console.log("👉 Request received:", req.body);

  try {
    const { url } = req.body;

    const result = await createShortUrl(url);

    console.log("✅ Short URL created:", result);

    res.json(result);
  } catch (err: any) {
    console.error("🔥 FULL ERROR:", err);
    res.status(500).json({
      error: "Server error",
      message: err?.message || err
    });
  }
};

export const redirectUrl = async (req: Request , res: Response) => {
  try {
    const { code } = req.params;

    const cached = await redisClient.get(typeof code === "string" ? code : code[0]);

    if (cached) {
      console.log("⚡ Cache hit");
      return res.redirect(cached);
    }

    console.log("❄️ Cache miss");

    // 🔥 STEP 2: fetch from DB
    const result = await pool.query(
      "SELECT original_url FROM urls WHERE short_code = $1",
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("URL not found");
    }

    const originalUrl = result.rows[0].original_url;

    await redisClient.set(typeof code === "string" ? code : code[0], originalUrl, {
      EX: 3600,
    });

    return res.redirect(originalUrl);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
};