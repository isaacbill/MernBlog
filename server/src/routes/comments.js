const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const { body, validationResult } = require("express-validator");

// Add comment
router.post("/", [
  body("post").notEmpty(),
  body("authorName").notEmpty(),
  body("body").notEmpty()
], async (req, res) => {
  const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const comment = await Comment.create(req.body);
  res.status(201).json(comment);
});

// Get comments for a post
router.get("/post/:postId", async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId }).sort({ createdAt: -1 });
  res.json(comments);
});

module.exports = router;
