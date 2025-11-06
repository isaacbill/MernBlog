const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const { body, validationResult } = require("express-validator");

// GET all
router.get("/", async (req, res) => {
  const cats = await Category.find();
  res.json(cats);
});

// POST create
router.post("/", [body("name").notEmpty()], async (req, res) => {
  const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name } = req.body;
  const category = await Category.create({ name });
  res.status(201).json(category);
});

module.exports = router;
