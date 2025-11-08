import express from "express";
import * as postController from "../controllers/postController.mjs";

const router = express.Router();

// Routes
// HTML view routes (server-side rendered)
router.get("/", postController.getAllPosts);
router.get("/blog/post/:id", postController.getPostById);

// JSON API routes
router.get("/api/posts", postController.getAllPostsJson);
router.get("/api/posts/:id", postController.getPostByIdJson);

export default router;
