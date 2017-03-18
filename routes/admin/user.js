var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/blog';

/* GET login page. */
router.get('/login', function(req, res, next) {
	// 如果已经登录过，session存在
	// 那么该路由的处理应该跳转到admin
	if (req.session.isLogin) {
		res.redirect('/admin');
	} else {
		res.render('admin/login');		
	}
});

// 用户登录
// 通过session进行用户登录
// 输入用户名和密码，与数据库中的数据进行比较判断
// 如何输入正确，则跳转页面到admin，并且设置session
router.post('/signin', (req,res,next) => {
	// 获取用户名和密码
	let username = req.body.username;
	let password = req.body.password;
	// 需要连接数据库，进行比较
	MongoClient.connect(url, (err,db) => {
		if (err) throw err;
		let user = db.collection('user');
		user.find({username: username, password: password}).toArray((err,result) => {
			if (err) throw err;
			// result是一个数组，如果用户名和密码正确了，数组中有一对象
			// 如果用户名和密码错了，就是空数组
			if(result.length) {
				req.session.isLogin = 1;
				res.redirect('/admin');
			} else {
				// 用户名和密码错误
				res.redirect('/user/login');
			}
		});
	});
});

// 用户注销
// 注销后跳转到登录页面，并且把session销毁
router.get('/logout', (req,res,next) => {
	// 方式一：
	// req.session.isLogin = 0;
	// 方式二：
	req.session.destroy();
	res.redirect('/user/login');
});

module.exports = router;