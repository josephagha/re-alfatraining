'use strict';
const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Blog = require('../models/blog');

// All Authors Route  الراوتر العام لصفحة الكتاب
router.get('/', async (req, res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  try {
    const authors = await Author.find(searchOptions)
    res.render('authors/index', {
      authors: authors,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
});

// New Author Route راوتر صفحة اضافة كاتب جديد
router.get('/new', (req, res) => {
  res.render('authors/new', { author: new Author() })
});

// Create Author Route راوتر اضافة كاتب جديد
router.post('/', async (req, res) => {
  const author = new Author({
    name: req.body.name
  });
  try {
    const newAuthor = await author.save()
    res.redirect(`authors/${newAuthor.id}`)
  } catch {
    res.render('authors/new', {
      author: author,
      errorMessage: 'Error creating Author'
    })
  }
});

// البحث عن كاتب بحسب الايدي  Author by ID
router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
    const blogs = await Blog.find({ author: author.id }).limit(6).exec()
    res.render('authors/show', {
      author: author,
      blogsByAuthor: blogs
    })
  } catch {
    res.redirect('/')
  }
});

// Edit Author تعديل الكاتب 
router.get('/:id/edit', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
    res.render('authors/edit', { author: author })
  } catch {
    res.redirect('/authors')
  }
});

// تعديل على الكاتب 
router.put('/:id', async (req, res) => {
  let author
  try {
    author = await Author.findById(req.params.id)
    author.name = req.body.name
    await author.save()
    res.redirect(`/authors/${author.id}`)
  } catch {
    if (author == null) {
      res.redirect('/')
    } else {
      res.render('authors/edit', {
        author: author,
        errorMessage: 'Error updating Author'
      })
    }
  }
});

// حذف الكاتب 
router.delete('/:id', async (req, res) => {
  let author
  try {
    author = await Author.findById(req.params.id)
    await author.remove()
    res.redirect('/authors')
  } catch {
    if (author == null) {
      res.redirect('/')
    } else {
      res.redirect(`/authors/${author.id}`)
    }
  }
});

module.exports = router

