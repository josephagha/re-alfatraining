'use strict';
const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Blog = require('../models/blog');
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

// All Blogs Route الراوتر العام للبلوك
router.get('/', async (req, res) => {
  /*let query = Blog.find()
    if (req.query.title != null && req.query.title != '') {
      query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
     if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
      query = query.lte('publishDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
      query = query.gte('publishDate', req.query.publishedAfter)
    } */
  let searchOptions = {}
  if (req.query.blogTitle != null && req.query.blogTitle !== '') {
    searchOptions.blogTitle = new RegExp(req.query.blogTitle, 'i')
  }
  try {
   // const blogs = await query.exec()
   const blogs = await Blog.find(searchOptions)
    res.render('blogs/index', {
      blogs: blogs,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
});

// New blog Route راوتر البلوك الجديد
router.get('/new', async (req, res) => {
  renderNewPage(res, new Blog())
});

// Create blog Route راوتر انشاء مدونة جديدة
router.post('/', async (req, res) => {
  const blog = new Blog({
    blogTitle: req.body.blogTitle,
    author: req.body.author,
    subTitle: req.body.subTitle,
    blogText: req.body.blogText
  })
  saveCover(blog, req.body.cover)

  try {
    const newBlog = await blog.save()
    res.redirect(`blogs/${newBlog.id}`)
  } catch {
    renderNewPage(res, blog, true)
  }
});

// Show blog Route راوتر اظهار البلوك بالايدي
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author')
      .exec()
    res.render('blogs/show', { blog: blog })
  } catch {
    res.redirect('/')
  }
});

// Edit blog Route تعديل البلوك
router.get('/:id/edit', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
    renderEditPage(res, blog)
  } catch {
    res.redirect('/')
  }
});

// Update تعديل البلوك
router.put('/:id', async (req, res) => {
  let blog

  try {
    blog = await Blog.findById(req.params.id)
    blog.blogTitle = req.body.blogTitle
    blog.author = req.body.author
    blog.subTitle = req.body.subTitle
    blog.blogText = req.body.blogText
    if (req.body.cover != null && req.body.cover !== '') {
      saveCover(blog, req.body.cover)
    }
    await blog.save()
    res.redirect(`/blogs/${blog.id}`)
  } catch {
    if (blog != null) {
      renderEditPage(res, blog, true)
    } else {
      redirect('/')
    }
  }
});

// Delete  حذف البلوك
router.delete('/:id', async (req, res) => {
  let blog
  try {
    blog = await Blog.findById(req.params.id)
    await blog.remove()
    res.redirect('/blogs')
  } catch {
    if (blog != null) {
      res.render('blogs/show', {
        blog: blog,
        errorMessage: 'Could not remove blog'
      })
    } else {
      res.redirect('/')
    }
  }
});

//FUNCTION 
async function renderNewPage(res, blog, hasError = false) {
  renderFormPage(res, blog, 'new', hasError)
}

async function renderEditPage(res, blog, hasError = false) {
  renderFormPage(res, blog, 'edit', hasError)
}

async function renderFormPage(res, blog, form, hasError = false) {
  try {
    const authors = await Author.find({})
    const params = {
      authors: authors,
      blog: blog
    }
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Error Updating blog'
      } else {
        params.errorMessage = 'Error Creating blog'
      }
    }
    res.render(`blogs/${form}`, params)
  } catch {
    res.redirect('/blogs')
  }
};

function saveCover(blog, coverEncoded) {
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    blog.coverImage = new Buffer.from(cover.data, 'base64')
    blog.coverImageType = cover.type
  }
};

module.exports = router