import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

let redisClient: any = null;

if (process.env.REDIS_URL) {
  redisClient = createClient({
    url: process.env.REDIS_URL,
  });

  redisClient.on("error", (err: any) => {
    console.error("❌ Redis Error:", err.message);
  });

  redisClient.on("connect", () => {
    console.log("✅ Redis connected");
  });

  (async () => {
    try {
      await redisClient.connect();
    } catch (err) {
      console.error("❌ Redis connection failed");
    }
  })();
} else {
  console.log("⚠️ Redis disabled (no REDIS_URL)");
}

export default redisClient;