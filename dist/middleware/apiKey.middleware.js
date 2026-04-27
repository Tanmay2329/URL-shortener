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
exports.validateApiKey = void 0;
const db_1 = __importDefault(require("../config/db"));
const validateApiKey = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        return res.status(401).json({ error: "API key required" });
    }
    const result = yield db_1.default.query('SELECT * FROM api_keys WHERE api_key = $1', [apiKey]);
    if (result.rows.length === 0) {
        return res.status(403).json({ error: "Invalid API key" });
    }
    next();
});
exports.validateApiKey = validateApiKey;
