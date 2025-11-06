const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Post = require("../models/Post");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

// GET /api/posts?search=&page=&limit=&category=
router.get("/", async (req, res) => {
  const { page = 1, limit = 10, q = "", category } = req.query;
  const query = {};
  if (q) query.title = { $regex: q, $options: "i" };
  if (category) query.category = category;
  const total = await Post.countDocuments(query);
  const posts = await Post.find(query)
    .populate("author", "name")
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .skip((page-1)*limit)
    .limit(Number(limit));
  res.json({ data: posts, total });
});

// GET /:id
router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id).populate("author category");
  if (!post) return res.status(404).json({ message: "Not found" });
  res.json(post);
});

// POST create (authenticated)
router.post("/", auth, upload.single("featuredImage"), [
  body("title").notEmpty(),
  body("body").notEmpty()
], async (req, res) => {
  const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { title, body: content, category } = req.body;
  const slug = title.toLowerCase().replace(/\s+/g,'-').replace(/[^\w\-]+/g,'');
  const featuredImage = req.file ? `/uploads/${req.file.filename}` : undefined;
  const post = await Post.create({ title, slug, body: content, author: req.user._id, category, featuredImage });
  res.status(201).json(post);
});

// PUT update
router.put("/:id", auth, upload.single("featuredImage"), async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Not found" });
  if (String(post.author) !== String(req.user._id)) return res.status(403).json({ message: "Forbidden" });
  const updates = req.body;
  if (req.file) updates.featuredImage = `/uploads/${req.file.filename}`;
  const updated = await Post.findByIdAndUpdate(req.params.id, updates, { new: true });
  res.json(updated);
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Not found" });
  if (String(post.author) !== String(req.user._id))
    return res.status(403).json({ message: "Forbidden" });

  // Correct method
  await post.deleteOne(); // <-- was post.delete()

  res.json({ message: "Deleted" });
  
});


module.exports = router;
