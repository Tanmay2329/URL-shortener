import express from "express";
import { validateApiKey } from "../middleware/apiKey.middleware";

import {
  shortenUrl,
  redirectUrl,
  getAnalytics
} from "../controllers/url.controller";

const router = express.Router();

router.post("/shorten", validateApiKey, shortenUrl);

// 🔥 MUST come BEFORE /:code
router.get("/analytics/:code", getAnalytics);

// redirect LAST
router.get("/:code", redirectUrl);

export default router;