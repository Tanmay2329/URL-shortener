// import { createClient } from "redis";

// const client = createClient({
//   socket: {
//     host: 'redis-db' ,
//     port: 6379,
//   },  // ✅ use env variable
// });

// client.on("error", (err) => {
//   console.error("Redis Error:", err);
// });

// (async () => {
//   try {
//     await client.connect();
//     console.log("Redis connected");
//   } catch (err) {
//     console.error("Redis connection failed");
//   }
// })(); 

// export default client;

import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const client = createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (err) => {
  console.error("❌ Redis Error:", err);
});

(async () => {
  try {
    await client.connect();
    console.log("Redis connected");
  } catch (err) {
    console.error("Redis connection failed");
  }
})();

export default client;