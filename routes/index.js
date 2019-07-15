'use strict';
const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');

router.get('/', async (req, res) => {
  let blogs
  try {
    blogs = await Blog.find().sort({ createdAt: 'desc' }).limit(10).exec()
  } catch {
    blogs = []
  }
 res.render('index', { blogs: blogs })
});

module.exports = router