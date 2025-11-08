import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectToDatabase } from "./db.mjs";
import postRoutes from "./routes/postRoutes.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// CORS: allow Live Server defaults (127.0.0.1:5500, localhost:5500) or override via CORS_ORIGINS env (comma-separated)
const defaultAllowed = ["http://127.0.0.1:5500", "http://localhost:5500"];
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const origins = allowedOrigins.length ? allowedOrigins : defaultAllowed;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || origins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "HEAD", "OPTIONS"],
  })
);
// Handle preflight
app.options("*", cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Connect to database
await connectToDatabase();

// Routes
app.use("/", postRoutes);

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 Educational routes:`);
  console.log(`   - http://localhost:${PORT}/ (List all posts)`);
  console.log(`\n🔗 API routes:`);
  console.log(`   - GET http://localhost:${PORT}/api/posts`);
  console.log(`   - GET http://localhost:${PORT}/api/posts/:id`);
});
