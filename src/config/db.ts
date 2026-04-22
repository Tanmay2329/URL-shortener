import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || "postgres",
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'urlshortener',
});

async function initDB() {
  try {
    await pool.connect();
    console.log("✅ Connected to PostgreSQL");

    // 👉 CREATE TABLE HERE
    await pool.query(`
      CREATE TABLE IF NOT EXISTS urls (
        id SERIAL PRIMARY KEY,
        original_url TEXT NOT NULL,
        short_code VARCHAR(10) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        click_count INT DEFAULT 0
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS clicks (
        id SERIAL PRIMARY KEY,
        short_code VARCHAR(10),
        clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(45)
      );
    `);

    console.log("✅ Table ready");
  } catch (err) {
    console.error("❌ DB Error:", err);
  }
}

initDB();

export default pool;
