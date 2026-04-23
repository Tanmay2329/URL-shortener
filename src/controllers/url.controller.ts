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

export const redirectUrl = async (req: Request, res: Response) => {
  try {
    const code = Array.isArray(req.params.code) ? req.params.code[0] : req.params.code;

    // ✅ CACHE CHECK
    if (redisClient) {
      const cached = await redisClient.get(code);
      if (cached) {
        console.log("⚡ Cache hit");

        console.log("🔥 Before logging click");
        // 🔥 LOG CLICK EVEN ON CACHE
        await logClick(
          code,
          req.ip || "unknown",
          req.headers["user-agent"] || "unknown"
        );

        console.log("🔥 After logging click");

        return res.redirect(cached);
      }
    }

    console.log("❄️ Cache miss");

    // ✅ FETCH FROM DB
    const result = await pool.query(
      "SELECT original_url FROM urls WHERE short_code = $1",
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("URL not found");
    }

    const originalUrl = result.rows[0].original_url;

    // ✅ STORE IN CACHE
    if (redisClient) {
      await redisClient.set(code, originalUrl, { EX: 3600 });
    }

    // 🔥 LOG CLICK
    await logClick(
      code,
      req.ip || "unknown",
      req.headers["user-agent"] || "unknown"
    );

    return res.redirect(originalUrl);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
};

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;

    // 🔥 Total clicks
    const totalResult = await pool.query(
      "SELECT COUNT(*) FROM clicks WHERE short_code = $1",
      [code]
    );

    // 🔥 Recent clicks
    const recentResult = await pool.query(
      `SELECT ip_address, user_agent, clicked_at
       FROM clicks
       WHERE short_code = $1
       ORDER BY clicked_at DESC
       LIMIT 10`,
      [code]
    );

    const trendResult = await pool.query(
      `SELECT DATE(clicked_at) as date, COUNT(*) as clicks
       FROM clicks
       WHERE short_code = $1
       GROUP BY date
       ORDER BY date DESC`,
      [code]
    );

    const ipResult = await pool.query(
      `SELECT ip_address, COUNT(*) as count
       FROM clicks
       WHERE short_code = $1
       GROUP BY ip_address
       ORDER BY count DESC
       LIMIT 5`,
      [code]
    );

    res.json({
      shortCode: code,
      totalClicks: totalResult.rows[0].count,
      recentClicks: recentResult.rows,
      clickOverTime: trendResult.rows,
      topIPs: ipResult.rows,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analytics error" });
  }
};