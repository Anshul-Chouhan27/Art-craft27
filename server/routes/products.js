import express from "express";
import multer from "multer";
import Product from "../models/Product.js";
import { requireAuth } from "../middleware/auth.js";
import { storage } from "../configcloudinary.js";  // 👈 import cloudinary storage
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

// Multer setup with Cloudinary
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
    if (!prod) return res.status(404).json({ error: "Not found" });
    res.json(prod);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// CREATE product (auth)
router.post("/", requireAuth, upload.single("image"), async (req, res) => {
  try {
    const { title, price, description, buyUrl } = req.body;
    const image = req.file?.path || ""; // 👈 Cloudinary se url milega

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
    if (!prod) return res.status(404).json({ error: "Not found" });

    if (req.file) {
      // Agar purani image Cloudinary me hai to delete kar sakte ho (optional)
      if (prod.image && prod.image.includes("cloudinary.com")) {
        const publicId = prod.image.split("/").pop().split(".")[0];
        try {
          await cloudinary.uploader.destroy("Art-Craft/" + publicId);
        } catch (e) {
          console.log("Cloudinary delete error", e.message);
        }
      }
      prod.image = req.file.path; // new image url
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

    // Agar image Cloudinary me hai to delete karo
    if (deleted.image && deleted.image.includes("cloudinary.com")) {
      const publicId = deleted.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy("Art-Craft/" + publicId);
      } catch (e) {
        console.log("Cloudinary delete error", e.message);
      }
    }

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
