import BlogPost from "../models/blogspot.mjs";

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find();

    // Demonstrate virtuals and methods
    const postsWithExtras = posts.map((post) => ({
      id: post._id,
      title: post.title,
      body: post.body,
      url: post.url, // Virtual property
      summary: post.getSummary(50), // Instance method
    }));

    res.render("index", { posts: postsWithExtras });
  } catch (error) {
    res.status(500).send("Error fetching posts: " + error.message);
  }
};

// Get single post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).send("Post not found");
    }

    res.render("post", {
      post: {
        id: post._id,
        title: post.title,
        body: post.body,
        url: post.url, // Virtual
      },
    });
  } catch (error) {
    res.status(500).send("Error fetching post: " + error.message);
  }
};

// ==========================================================
// JSON API versions of the above (no server-side rendering)
// ==========================================================
// GET /api/posts -> list all posts as JSON
export const getAllPostsJson = async (req, res) => {
  try {
    const posts = await BlogPost.find();
    const data = posts.map((post) => ({
      id: post._id,
      title: post.title,
      body: post.body,
      url: post.url, // virtual
      summary: post.getSummary(100),
    }));
    res.json({ data, count: data.length });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching posts", message: error.message });
  }
};

// GET /api/posts/:id -> single post as JSON
export const getPostByIdJson = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json({
      data: {
        id: post._id,
        title: post.title,
        body: post.body,
        url: post.url,
        summary: post.getSummary(200),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching post", message: error.message });
  }
};
