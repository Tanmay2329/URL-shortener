import pool from "../config/db";

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

  // const query = `
  //   INSERT INTO urls (original_url, short_code)
  //   VALUES ($1, $2)
  //   RETURNING *
  // `;

  const result = await pool.query(
    "INSERT INTO urls (original_url, short_code) VALUES ($1, $2) RETURNING *",
    [OriginalUrl, shortCode]
  );
  
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const shortUrl = `${baseUrl}/${shortCode}`;
  console.log("BASE_URL:", process.env.BASE_URL);
  return {
    shortUrl,
    data: result.rows[0],
  };
};

export const getOriginalUrl = async (shortCode: string) => {
  const result = await pool.query(
    "SELECT original_url FROM urls WHERE short_code = $1",
    [shortCode]
  );

  return result.rows[0]?.original_url;
};