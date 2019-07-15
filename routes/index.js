const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Blog = require('../models/blog')

router.get('/', async (req, res) => {
  //let books
  let blogs
  try {
    //books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec()
    blogs = await Blog.find().sort({ createdAt: 'desc' }).limit(10).exec()
  } catch {
    //books = []
    blogs = []
  }
 // res.render('index', { books: books })
 res.render('index', { blogs: blogs })
})

module.exports = router