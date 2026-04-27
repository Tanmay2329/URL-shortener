import express from "express";
import  pool  from "../config/db";

const router = express.Router();

router.get("/:code", async (req, res) => {
    try { 
        const { code } = req.params;
        
        // get URL info
        const UrlResult = await pool.query(
            "SELECT * FROM urls WHERE short_code = $1",
            [code]
        );

        if (UrlResult.rows.length === 0) {
            return res.status(404).json({ error: "URL not found" });
          }

        const clickResult = await pool.query(
            "SELECT COUNT(*) FROM clicks WHERE short_code = $1",
            [code]
        );

        res.json({
            original_url: UrlResult.rows[0].original_url,
            short_code: code,
            total_clicks: clickResult.rows[0].count,
            created_at: UrlResult.rows[0].created_at,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }  
});

export default router;