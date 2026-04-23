"use strict";
// src/controllers/url.controller.ts
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
exports.redirectUrl = exports.shortenUrl = void 0;
const url_service_1 = require("../services/url.service");
const db_1 = __importDefault(require("../config/db"));
const redis_1 = __importDefault(require("../config/redis"));
const shortenUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("👉 Request received:", req.body);
    try {
        const { url } = req.body;
        const result = yield (0, url_service_1.createShortUrl)(url);
        console.log("✅ Short URL created:", result);
        res.json(result);
    }
    catch (err) {
        console.error("🔥 FULL ERROR:", err);
        res.status(500).json({
            error: "Server error",
            message: (err === null || err === void 0 ? void 0 : err.message) || err
        });
    }
});
exports.shortenUrl = shortenUrl;
const redirectUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code } = req.params;
        const cached = yield redis_1.default.get(typeof code === "string" ? code : code[0]);
        if (cached) {
            console.log("⚡ Cache hit");
            return res.redirect(cached);
        }
        console.log("❄️ Cache miss");
        // 🔥 STEP 2: fetch from DB
        const result = yield db_1.default.query("SELECT original_url FROM urls WHERE short_code = $1", [code]);
        if (result.rows.length === 0) {
            return res.status(404).send("URL not found");
        }
        const originalUrl = result.rows[0].original_url;
        yield redis_1.default.set(typeof code === "string" ? code : code[0], originalUrl, {
            EX: 3600,
        });
        return res.redirect(originalUrl);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Server error");
    }
});
exports.redirectUrl = redirectUrl;
