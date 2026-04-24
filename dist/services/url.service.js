"use strict";
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
exports.logClick = exports.getOriginalUrl = exports.createShortUrl = void 0;
const db_1 = __importDefault(require("../config/db"));
const redis_1 = __importDefault(require("../config/redis"));
function generateShortCode(length = 6) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
const createShortUrl = (OriginalUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const shortCode = generateShortCode();
    const result = yield db_1.default.query("INSERT INTO urls (original_url, short_code) VALUES ($1, $2) RETURNING *", [OriginalUrl, shortCode]);
    yield redis_1.default.set(shortCode, OriginalUrl, {
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
});
exports.createShortUrl = createShortUrl;
const getOriginalUrl = (shortCode) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // 🔥 STEP 1: CHECK CACHE FIRST
    const cached = yield redis_1.default.get(shortCode);
    if (cached) {
        console.log("⚡ Cache HIT:", shortCode);
        return cached;
    }
    // 🔥 STEP 2: IF NOT IN CACHE → DB
    console.log("🐢 Cache MISS → DB:", shortCode);
    const result = yield db_1.default.query("SELECT original_url FROM urls WHERE short_code = $1", [shortCode]);
    const originalUrl = (_a = result.rows[0]) === null || _a === void 0 ? void 0 : _a.original_url;
    // 🔥 STEP 3: STORE IN CACHE
    if (originalUrl) {
        yield redis_1.default.set(shortCode, originalUrl, {
            EX: 3600,
        });
    }
    return originalUrl;
});
exports.getOriginalUrl = getOriginalUrl;
const logClick = (shortCode, ip, userAgent) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(" Logging click for:", shortCode);
        yield db_1.default.query(`INSERT INTO clicks (short_code, ip_address, user_agent)
       VALUES ($1, $2, $3)`, [shortCode, ip, userAgent]);
        console.log("📊 Click logged successfully:");
    }
    catch (err) {
        console.error("❌ Click log failed:", err);
    }
});
exports.logClick = logClick;
