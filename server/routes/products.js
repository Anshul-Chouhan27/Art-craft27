import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Product from "../models/Product.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Multer setup for local uploads
const uploadDir = path.resolve("uploads");
if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage });

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET single product
router.get("/:id", async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if(!prod) return res.status(404).json({ error: "Not found" });
    res.json(prod);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// CREATE product (auth)
router.post("/", requireAuth, upload.single("image"), async (req, res) => {
  try {
    const { title, price, description, buyUrl } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";
    const p = await Product.create({ title, price, description, buyUrl, image });
    res.json(p);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// UPDATE product (auth)
router.put("/:id", requireAuth, upload.single("image"), async (req, res) => {
  try {
    const { title, price, description, buyUrl } = req.body;
    const prod = await Product.findById(req.params.id);
    if(!prod) return res.status(404).json({ error: "Not found" });

    // If new image uploaded, remove old file (best-effort)
    if (req.file) {
      if (prod.image && prod.image.startsWith("/uploads/")) {
        const oldPath = path.resolve("." + prod.image);
        try { if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath); } catch(e){}
      }
      prod.image = `/uploads/${req.file.filename}`;
    }

    prod.title = title ?? prod.title;
    prod.price = price ?? prod.price;
    prod.description = description ?? prod.description;
    prod.buyUrl = buyUrl ?? prod.buyUrl;

    await prod.save();
    res.json(prod);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE product (auth)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    // remove image file if present
    if (deleted.image && deleted.image.startsWith("/uploads/")) {
      const imgPath = path.resolve("." + deleted.image);
      try { if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath); } catch(e){}
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
