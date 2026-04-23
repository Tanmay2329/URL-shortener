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
exports.getOriginalUrl = exports.createShortUrl = void 0;
const db_1 = __importDefault(require("../config/db"));
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
    // const query = `
    //   INSERT INTO urls (original_url, short_code)
    //   VALUES ($1, $2)
    //   RETURNING *
    // `;
    const result = yield db_1.default.query("INSERT INTO urls (original_url, short_code) VALUES ($1, $2) RETURNING *", [OriginalUrl, shortCode]);
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const shortUrl = `${baseUrl}/${shortCode}`;
    console.log("BASE_URL:", process.env.BASE_URL);
    return {
        shortUrl,
        data: result.rows[0],
    };
});
exports.createShortUrl = createShortUrl;
const getOriginalUrl = (shortCode) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield db_1.default.query("SELECT original_url FROM urls WHERE short_code = $1", [shortCode]);
    return (_a = result.rows[0]) === null || _a === void 0 ? void 0 : _a.original_url;
});
exports.getOriginalUrl = getOriginalUrl;
