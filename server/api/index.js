// api/index.js
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { connectDB } from "../config_db.js";
import productsRouter from "../routes/products.js";
import authRouter from "../routes/auth.js";
import serverless from "serverless-http";

dotenv.config();
const app = express();

// CORS setup
const ORIGIN = process.env.CLIENT_ORIGIN || "*";
app.use(cors({ origin: ORIGIN, credentials: true }));

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.get("/", (req, res) => res.json({ status: "ok", message: "ArtShop API v3" }));
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);

// MongoDB connection
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/artshop";
connectDB(uri)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Export serverless handler
export const handler = serverless(app);
