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
// CORS: now permissive (allows all origins). To restrict again, set RESTRICT_CORS=true
// and provide a comma-separated ALLOWED_ORIGINS env variable.
if (process.env.RESTRICT_CORS === "true") {
  const allowed = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  app.use(
    cors({
      origin(origin, cb) {
        if (!origin || allowed.length === 0 || allowed.includes(origin))
          return cb(null, true);
        return cb(new Error("CORS blocked: " + origin));
      },
      methods: ["GET", "HEAD", "OPTIONS"],
    })
  );
  app.options("*", cors());
} else {
  // Fully open CORS (all origins, default safe methods)
  app.use(cors({ origin: true }));
  app.options("*", cors());
}

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
