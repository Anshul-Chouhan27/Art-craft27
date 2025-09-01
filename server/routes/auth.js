import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { password } = req.body || {};
    if(!password) return res.status(400).json({ error: "Password required" });
    const HASH = process.env.ADMIN_PASSWORD_HASH || "";
    if(!HASH) return res.status(500).json({ error: "Server not configured" });
    const ok = await bcrypt.compare(password, HASH);
    if(!ok) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "2d" });
    res.json({ token });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
