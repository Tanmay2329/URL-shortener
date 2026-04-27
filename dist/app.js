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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const url_routes_1 = __importDefault(require("./routes/url.routes"));
const db_1 = __importDefault(require("./config/db"));
const stats_routes_1 = __importDefault(require("./routes/stats.routes"));
const rateLimiter_1 = require("./middleware/rateLimiter");
const app = (0, express_1.default)();
// ✅ CORS — add your frontend Railway URL here once deployed
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://url-shortener-production-7137.up.railway.app',
        // 'https://your-frontend-railway-url.up.railway.app' ← add after deploying frontend
    ],
    methods: ['GET', 'POST'],
}));
// ✅ Single express.json()
app.use(express_1.default.json());
// ✅ Trust proxy once
app.set("trust proxy", 1);
// ✅ Rate limiter once globally
app.use(rateLimiter_1.rateLimiter);
// ✅ Routes in correct order
app.use("/", url_routes_1.default);
app.use("/stats", stats_routes_1.default);
// ✅ DB connection test
(() => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield db_1.default.query('SELECT NOW()');
    console.log("✅ DB connected:", res.rows);
}))();
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
});
