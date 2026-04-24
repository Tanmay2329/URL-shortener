import dotenv from 'dotenv';
dotenv.config();


import pool from './config/db';
import { generateApiKey } from './utils/generateApiKey';


async function createKey() {
  const key = generateApiKey();

  await pool.query(
    'INSERT INTO api_keys (api_key) VALUES ($1)',
    [key]
  );

  console.log("✅ Your API Key:", key);
  process.exit();
}

createKey();