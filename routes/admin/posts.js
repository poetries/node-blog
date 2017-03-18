const express = require('express');
const router = express.Router();

const moment = require('moment');

var fs = require('fs');

//引入multiparty模块，处理文件上传 
const multiparty = require('multiparty');

const ObjectId = require('objectid');

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/blog';

/* 文章列表显示页面 */
router.get('/', (req,res,next) => {
	MongoClient.connect(url, (err,db) => {
		if (err) throw err;
		let posts = db.collection('posts');
		posts.find().toArray((err,result) => {
			if (err) throw err;
			res.render('admin/posts_list',{data:result});
		});
	});
});

/* 添加文章页面 */
router.get('/add', (req,res,next) => {
	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		let cats = db.collection('cats');
		cats.find().toArray((err,result1)=>{
			if (err) throw err;
			let tags = db.collection('tags');
			tags.find().toArray((err,result2)=>{
				res.render('admin/posts_add',{cats:result1, tags:result2});
			});
		});
	});
});

/* 添加文章操作 */
// 第一步，获取表单提交的数据
// 第二步，把数据保存到数据库中
// 注意两点：
// 1.图片的提交需要用到multiparty模块，进行处理
// 在模板中form需要设置属性enctype="multipart/form-data"
// 2.文章内容用markdown格式书写
// 简单情况下，在服务器端，用markdown模块把md格式的内容转换成html
// 但是传递到数据库中是字符串形式
// 所以我们还需要在浏览器端，用到markdown.js进行转换
router.post('/insert', (req,res,next) => {
	// 所有的文件上传后，都会在一个临时文件中保存
	// 而在window操作系统下，不允许跨磁盘另存文件
	// 所以我们指定一下临时文件存储的目录
	let form = new multiparty.Form({uploadDir : 'public/tmp'});
	// 使用form对象的parse方法
	form.parse(req, (err,fields,files) => {
		if (err) throw err;
		// console.log(fields);
		// console.log(files);
		// 返回两个对象
		// fields：除file之外的其他所有表单域的提交信息
		// files：文件域file提交的详细信息
		// 获取到这两个对象之后
		// 第一：将图片从保存的临时目录，转移到项目目录下
		fs.renameSync(files.cover[0].path, 'public/uploads/' + files.cover[0].originalFilename);
		// 第二：文章的信息保存到数据库中
		// 构造一个对象
		let article = {
			title : fields.title[0],
			cat : fields.cat[0],
			tag : fields.tag,
			summary : fields.summary[0],
			content : fields.content[0],
			day : moment().format('D'),
			ym : moment().format('YYYY,MMM'),
			wmdy : moment().format('dddd, MMMM Do YYYY'),
			ymd : moment().format('YYYY-M-D'),
			time : new Date(),
			cover : 'uploads/' + files.cover[0].originalFilename
		};
		MongoClient.connect(url, (err,db) => {
			if (err) throw err;
			let posts = db.collection('posts');
			posts.insert(article, (err,result) => {
				if (err) {
					res.render('admin/message', {message:'添加文章失败！'});
				} else {
					res.render('admin/message', {message:'添加文章成功！'});
				}
			});
		});
	});
});

/* 文章编辑页面 */
router.get('/edit', (req,res,next) => {
	let id = req.query.id;
	MongoClient.connect(url, (err,db) => {
		if (err) throw err;
		let posts = db.collection('posts');
		posts.find({_id:ObjectId(id)}).toArray((err,result1) => {
			if (err) throw err;
			let cats = db.collection('cats');
			cats.find().toArray((err,result2)=>{
				if(err) throw err;
				let tags = db.collection('tags');
				tags.find().toArray((err,result3)=>{
					res.render('admin/posts_edit',{data: result1[0], cats: result2, tags: result3});					
				});
			});
		});
	});
});

/* 文章更新 */
router.post('/update', (req,res,next) => {
	let form = new multiparty.Form({uploadDir : 'public/tmp'});
	form.parse(req, (err,fields,files) => {
		if (err) throw err;
		fs.renameSync(files.cover[0].path, 'public/uploads/' + files.cover[0].originalFilename);
		let article = {
			title : fields.title[0],
			cat : fields.cat[0],
			tag : fields.tag,
			summary : fields.summary[0],
			content : fields.content[0],
			cover : 'public/uploads/' + files.cover[0].originalFilename
		};
		// console.log(fields.title[0]);
		MongoClient.connect(url, (err,db) => {
			if (err) throw err;
			let posts = db.collection('posts');
			posts.update({_id:ObjectId(fields.id[0])},article, (err,result) => {
				if (err) {
					res.render('admin/message', {message:'文章更新失败！'});
				} else {
					res.render('admin/message', {message:'文章更新成功！'});
				}
			});
		});
	});
});

/* 文章删除 */
router.get('/delete', (req,res,next) => {
	let id = req.query.id;
	MongoClient.connect(url, (err,db) => {
		if (err) throw err;
		let posts = db.collection('posts');
		posts.remove({_id: ObjectId(id)}, (err,result) => {
			if (err) {
				res.render('admin/message', {message:'删除文章失败！'});
			} else {
				res.render('admin/message', {message:'删除文章成功！'});
			}
		});
	});
});

module.exports = router;