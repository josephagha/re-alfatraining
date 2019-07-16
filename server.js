'use strict';
//للتحقق بحال كنا في مرحلة البرمجة
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
};

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

//اضافة البدي بارثر التي تساعد بالعمل على البوست القادم من الكلينت
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

//استيراد ملغ الراوتر
const indexRouter = require('./routes/index');
const authorRouter = require('./routes/authors');
const blogRouter = require('./routes/blogs');

//تحديد التيملت انجن
app.set('view engine', 'ejs');
// تحديد ملف الفيو
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout')
app.use(expressLayouts);
app.use(methodOverride('_method'));
//اين يكون الببلك فايل
app.use(express.static('public'));
//اخبار السيرفر كيف يستخدم البديبارثر - ليمت الرفع 10 ميكا 
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));

//اضافة المنكوديبي
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL || "mongodb+srv://user:ECXs7ml6Yvc6PKdZ@cluster0-idk3j.mongodb.net/test?retryWrites=true&w=majority",
{ useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to Mongoose'));

//استخدام ملف الراوتر
app.use('/', indexRouter);
app.use('/authors', authorRouter);
app.use('/blogs', blogRouter);

//لتحديد حسب ما يختار السرفير لكن الـ 3000 لمرحلة البرمجة
app.listen(process.env.PORT || 3000);


//sudo service mongodb start
//mongo 
//ECXs7ml6Yvc6PKdZ
