// api/index.js
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "../config_db.js";
import productsRouter from "../routes/products.js";
import authRouter from "../routes/auth.js";
import serverless from "serverless-http";

dotenv.config();
const app = express();
const ORIGIN = process.env.CLIENT_ORIGIN || "*";

app.use(cors({ origin: ORIGIN }));
app.use(express.json());
app.use(morgan("dev"));

// static uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// routes
app.get("/", (req, res) => res.json({ status: "ok", message: "ArtShop API v3" }));
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);

// connect DB
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/artshop";
connectDB(uri).then(() => {
  console.log("✅ Connected to MongoDB");
});

export default serverless(app);
