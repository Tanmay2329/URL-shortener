"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//const apiKey_middleware_1 = require("../middleware/apiKey.middleware");
const url_controller_1 = require("../controllers/url.controller");
const router = express_1.default.Router();
router.post("/shorten", url_controller_1.shortenUrl);
// 🔥 MUST come BEFORE /:code
router.get("/analytics/:code", url_controller_1.getAnalytics);
// redirect LAST
router.get("/:code", url_controller_1.redirectUrl);
exports.default = router;
