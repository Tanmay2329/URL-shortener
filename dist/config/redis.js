"use strict";
// import { createClient } from "redis";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = (0, redis_1.createClient)({
    url: process.env.REDIS_URL,
});
client.on("error", (err) => {
    console.error("❌ Redis Error:", err);
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        console.log("Redis connected");
    }
    catch (err) {
        console.error("Redis connection failed");
    }
}))();
exports.default = client;
