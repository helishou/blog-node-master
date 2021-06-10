/*
 * @Author: helishou 
 * @Date: 2021-05-31 14:36:37 
 * @Last Modified by:   helishou 
 * @Last Modified time: 2021-05-31 14:36:37 
 */
// modules
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');//HTTP request logger middleware for node.js
const session = require('express-session');

// import 等语法要用到 babel 支持
require('babel-register');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//以上代码用于配置页面文件(例如 .ejs 文件)的根目录，
app.use(logger('dev'));
//输出日志
app.use(express.json());//解析content-type：application /json

app.use(express.urlencoded({ extended: false }));//类似表单提交参数获取//可将字符串以URL编码，用于编码处理
app.use(express.static(path.join(__dirname, 'public')));//静态文件目录

app.use(cookieParser('blog_node_cookie'));//使用签名
app.use(
	session({
		secret: 'blog_node_cookie',
		name: 'session_id', //# 在浏览器中生成cookie的名称key，默认是connect.sid
		resave: true,
		saveUninitialized: true,
		cookie: { maxAge: 60 * 1000 * 60 * 6, httpOnly: true }, //过期时间
	}),
);

const mongodb = require('./core/mongodb');

// data server
mongodb.connect();

//将路由文件引入
const route = require('./routes/index');

//初始化所有路由
route(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
