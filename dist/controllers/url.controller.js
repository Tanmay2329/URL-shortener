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
exports.getAnalytics = exports.redirectUrl = exports.shortenUrl = void 0;
const url_service_1 = require("../services/url.service");
const db_1 = __importDefault(require("../config/db"));
const validator_1 = __importDefault(require("validator"));
const shortenUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("👉 Request received:", req.body);
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ error: "URL is required" });
        }
        if (!validator_1.default.isURL(url, { require_protocol: true })) {
            return res.status(400).json({ error: 'Invalid URL format' });
        }
        const { shortUrl } = yield (0, url_service_1.createShortUrl)(req.body.url);
        console.log("✅ Short URL created:", shortUrl);
        res.json({ shortUrl });
    }
    catch (err) {
        console.error("🔥 FULL ERROR:", err);
        return res.status(500).json({
            error: "Server error",
            message: (err === null || err === void 0 ? void 0 : err.message) || err,
        });
    }
});
exports.shortenUrl = shortenUrl;
const redirectUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const code = Array.isArray(req.params.code)
            ? req.params.code[0]
            : req.params.code;
        // 🔥 FETCH FROM DB ONLY
        const result = yield db_1.default.query("SELECT original_url FROM urls WHERE short_code = $1", [code]);
        if (result.rows.length === 0) {
            return res.status(404).send("URL not found");
        }
        console.log("Headers:", {
            forwarded: req.headers["x-forwarded-for"],
            realIp: req.headers["x-real-ip"],
            reqIp: req.ip,
            socket: (_a = req.socket) === null || _a === void 0 ? void 0 : _a.remoteAddress
        });
        const originalUrl = result.rows[0].original_url;
        // 🔥 LOG CLICK
        const clientIp = ((_c = (_b = req.headers["x-forwarded-for"]) === null || _b === void 0 ? void 0 : _b.split(",")[0]) === null || _c === void 0 ? void 0 : _c.trim()) ||
            req.headers["x-real-ip"] ||
            ((_d = req.socket) === null || _d === void 0 ? void 0 : _d.remoteAddress) ||
            "unknown";
        yield (0, url_service_1.logClick)(code, clientIp, req.headers["user-agent"] || "unknown");
        return res.redirect(originalUrl);
    }
    catch (err) {
        console.error(err);
        return res.status(500);
    }
});
exports.redirectUrl = redirectUrl;
const getAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code } = req.params;
        // 🔥 Total clicks
        const totalResult = yield db_1.default.query("SELECT COUNT(*) FROM clicks WHERE short_code = $1", [code]);
        // 🔥 Recent clicks
        const recentResult = yield db_1.default.query(`SELECT ip_address, user_agent, clicked_at
       FROM clicks
       WHERE short_code = $1
       ORDER BY clicked_at DESC
       LIMIT 10`, [code]);
        const trendResult = yield db_1.default.query(`SELECT DATE(clicked_at) as date, COUNT(*) as clicks
       FROM clicks
       WHERE short_code = $1
       GROUP BY date
       ORDER BY date DESC`, [code]);
        const ipResult = yield db_1.default.query(`SELECT ip_address, COUNT(*) as count
       FROM clicks
       WHERE short_code = $1
       GROUP BY ip_address
       ORDER BY count DESC
       LIMIT 5`, [code]);
        res.json({
            shortCode: code,
            totalClicks: totalResult.rows[0].count,
            recentClicks: recentResult.rows,
            clickOverTime: trendResult.rows,
            topIPs: ipResult.rows,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Analytics error" });
    }
});
exports.getAnalytics = getAnalytics;
