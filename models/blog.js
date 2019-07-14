'use strict';
//استدعاء الداتا بيز المونكو
const mongoose = require('mongoose')

// استخدام السكيما لانشاء الحقول
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subTitle: {
    type: String,
    required: true
  },
  blogText: {
    type: String
  },
  publishDate: {
    type: Date,
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
  }
})

blogSchema.virtual('coverImagePath').get(function() {
  if (this.coverImage != null && this.coverImageType != null) {
    return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
  }
})

// تصدير السكيما اسم التيبل اوثر وتعريفه بالاوثرسكيما
module.exports = mongoose.model('Blog', blogSchema)