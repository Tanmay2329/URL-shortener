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
// src/app.ts
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const url_routes_1 = __importDefault(require("./routes/url.routes"));
const db_1 = __importDefault(require("./config/db"));
const url_controller_1 = require("./controllers/url.controller");
const stats_routes_1 = __importDefault(require("./routes/stats.routes"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const rateLimiter_1 = require("./middleware/rateLimiter");
const app = (0, express_1.default)();
app.use(rateLimiter_1.rateLimiter);
app.set("trust proxy", 1);
app.use(express_1.default.json());
app.use("/", url_routes_1.default);
app.get("/:code", url_controller_1.redirectUrl);
app.use("/stats", stats_routes_1.default);
app.use('/shorten', rateLimiter_1.rateLimiter);
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on ${process.env.PORT || 3000}`);
});
// simple test query
(() => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield db_1.default.query('SELECT NOW()');
    console.log(res.rows);
}))();
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 2,
});
app.use(limiter);
