'use strict';
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  blogTitle: {
    type: String,
    required: true
  },
  subTitle: {
    type: String,
    required: true
  },
  blogText: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  coverImage: {
    type: Buffer,
    required: true
  },
  coverImageType: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Author'
  }
});

blogSchema.virtual('coverImagePath').get(function() {
  if (this.coverImage != null && this.coverImageType != null) {
    return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
  }
});

module.exports = mongoose.model('Blog', blogSchema);