var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

// 引入自定义模块
var index = require('./routes/home/index');// 首页面
var entry = require('./routes/home/entry');// 博客主页面
var article = require('./routes/home/article');// 文章详情页面
var about = require('./routes/home/about');// 关于我页面
var archive = require('./routes/home/archive');// 归档
var tag = require('./routes/home/tag');// 标签

var user = require('./routes/admin/user');// 管理员登录页面
var admin = require('./routes/admin/admin');// 管理员操作页面
var cats  = require('./routes/admin/cats');// 分类操作
var posts = require('./routes/admin/posts');// 文章操作
var tags  = require('./routes/admin/tags');// 标签操作
var app = express();

app.use(session({
	secret: 'blog',
	resave: false,
	saveUninitialized: true,
	cookie: {}
}));

// view engine setup渲染模板格式设置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// 渲染模板文件格式设置为.html
// app.engine('html', require('ejs').__express);
// app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// 设置静态资源路径
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/entry', entry);
app.use('/article', article);
app.use('/about', about);
app.use('/archive', archive);
app.use('/tag', tag);

app.use('/user', user);
app.use('/admin', checkLogin);
app.use('/admin', admin);
app.use('/admin/cats', cats);
app.use('/admin/posts', posts);
app.use('/admin/tags', tags);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

// 自定义一个中间件，用于判断用户是否已经登录
function checkLogin(req,res,next){
	if (!req.session.isLogin) {
		res.redirect('/user/login');
		return;
	}
	next();
}

module.exports = app;
