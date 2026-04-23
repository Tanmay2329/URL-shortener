import pool from "../config/db";
import redis from "../config/redis";

function generateShortCode(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const createShortUrl = async (OriginalUrl: string) => {
  const shortCode = generateShortCode();

  const result = await pool.query(
    "INSERT INTO urls (original_url, short_code) VALUES ($1, $2) RETURNING *",
    [OriginalUrl, shortCode]
  );  

  await redis.set(shortCode,OriginalUrl, {
    EX: 3600, //1 house expiry
  });

  // const query = `
  //   INSERT INTO urls (original_url, short_code)
  //   VALUES ($1, $2)
  //   RETURNING *
  // `;
  
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const shortUrl = `${baseUrl}/${shortCode}`;

  return {
    shortUrl,
    data: result.rows[0],
  };
};

export const getOriginalUrl = async (shortCode: string) => {

  // 🔥 STEP 1: CHECK CACHE FIRST
  const cached = await redis.get(shortCode);

  if (cached) {
    console.log("⚡ Cache HIT:", shortCode);
    return cached;
  }

  // 🔥 STEP 2: IF NOT IN CACHE → DB
  console.log("🐢 Cache MISS → DB:", shortCode);

  const result = await pool.query(
    "SELECT original_url FROM urls WHERE short_code = $1",
    [shortCode]
  );

  const originalUrl = result.rows[0]?.original_url;

  // 🔥 STEP 3: STORE IN CACHE
  if (originalUrl) {
    await redis.set(shortCode, originalUrl, {
      EX: 3600,
    });
  }

  return originalUrl;
};

export const logClick = async (shortCode: string) => {
  try {
    await pool.query(
      "INSERT INTO clicks (short_code) VALUES ($1)",
      [shortCode]
    );
  } catch (err) {
    console.error("Click log error:", err);
  }
};