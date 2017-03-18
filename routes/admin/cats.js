const express = require('express');
const router = express.Router();

const ObjectId = require('objectid');

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/blog';

/* 分类显示页面 */
router.get('/', (req,res,next) => {
	// 连接数据库，读取数据，渲染到模板页面
	MongoClient.connect(url, (err,db) => {
		if (err) throw err;
		// 获取数据库中cats集合
		let cats = db.collection('cats');
		// 读取cats集合中的数据
		cats.find().toArray( (err,result) => {
			if (err) throw err;
			// 将结果渲染到模板页面
			res.render('admin/cats_list', {data:result});
		});
	});
});

/* 分类添加页面 */
router.get('/add', (req,res,next) => {
	res.render('admin/cats_add');
});

/* 添加分类 */
router.post('/insert', (req,res,next) =>{
	// 第一步，获取表单内容title
	let title = req.body.title;
	// 第二步，连接数据库，将数据形成集合insert到mongodb中
	MongoClient.connect(url, (err,db) => {
		if (err) throw err;
		let cats = db.collection('cats');
		cats.insert({title:title}, (err, result) => {
			if (err) {
				res.render('admin/message', {message:'添加分类失败！'});
			} else {
				res.render('admin/message', {message:'添加分类成功！'});
			}
		});
	});
});

/* 分类编辑页面和更新、删除操作，均需要借助到objectid这个模块
 * 因为在数据库中，_id的值保存的格式不是字符串，而是ObjectId
 * 而我们获取到的id值是字符串格式req.query.id
 * 所以借助第三方模块进行转换
 */

/* 分类编辑页面 */
router.get('/edit', (req,res,next) =>{
	let id    = req.query.id;
	MongoClient.connect(url, (err, db) => {
		if (err) throw err;
		let cats = db.collection('cats');
		cats.find({_id: ObjectId(id)}).toArray( (err, result) => {
			if (err) throw err;
			res.render('admin/cats_edit', {data:result[0]});
		});
	});
});

/* 更新分类 */
router.post('/update', (req,res,next) =>{
	// 第一步，获取表单提交数据
	let title = req.body.title;
	let id    = req.body.id;
	// 第二步，连接数据库，更新数据
	MongoClient.connect(url, (err,db) => {
		if (err) throw err;
		let cats = db.collection('cats');
		// 更新数据
		cats.update({_id:ObjectId(id)}, {title:title}, (err,result) =>{
			if (err) {
				res.render('admin/message', {message:'更新失败！'});
			} else {
				res.render('admin/message', {message:'更新成功！'});
			}
		});
	});
});

/* 删除分类 */
router.get('/delete', (req,res,next) =>{
	// 获取需要的_id
	let id = req.query.id;
	MongoClient.connect(url, (err, db) => {
		if (err) throw err;
		let cats = db.collection('cats');
		cats.remove({_id: ObjectId(id)}, (err,result) => {
			if (err) {
				res.render('admin/message', {message:'删除失败！'});
			} else {
				res.render('admin/message', {message:'删除成功！'});
			}
		});
	});
});

module.exports = router;