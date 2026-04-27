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
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../config/db"));
const router = express_1.default.Router();
router.get("/:code", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code } = req.params;
        // get URL info
        const UrlResult = yield db_1.default.query("SELECT * FROM urls WHERE short_code = $1", [code]);
        if (UrlResult.rows.length === 0) {
            return res.status(404).json({ error: "URL not found" });
        }
        const clickResult = yield db_1.default.query("SELECT COUNT(*) FROM clicks WHERE short_code = $1", [code]);
        res.json({
            original_url: UrlResult.rows[0].original_url,
            short_code: code,
            total_clicks: clickResult.rows[0].count,
            created_at: UrlResult.rows[0].created_at,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}));
exports.default = router;
