const express = require('express');
const router = express.Router();

const ObjectId = require('objectid');

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/blog';

/* 标签列表显示页面 */
router.get('/', (req,res,next) => {
	MongoClient.connect(url, (err,db) => {
		if (err) throw err;
		let tags = db.collection('tags');
		tags.find().toArray((err,result) => {
			if (err) throw err;
			res.render('admin/tags_list', {data:result});
		});
	});
});

/* 标签添加页面 */
router.get('/add', (req,res,next) => {
	res.render('admin/tags_add');
});

/* 添加标签 */
router.post('/insert', (req,res,next) => {
	// 获取表单提交数据
	let title = req.body.title;
	// 连接数据库
	MongoClient.connect(url, (err,db) => {
		if (err) throw err;
		let tags = db.collection('tags');
		tags.insert({title: title},(err,result) => {
			if (err) {
				res.render('admin/message', {message: '添加标签失败！'});
			} else {
				res.render('admin/message', {message: '添加标签成功！'});
			}
		});
	});
});

/* 标签编辑页面 */
router.get('/edit', (req,res,next) => {
	let id = req.query.id;
	MongoClient.connect(url, (err,db) => {
		if (err) throw err;
		let tags = db.collection('tags');
		tags.find({_id: ObjectId(id)}).toArray((err,result)=>{
			if (err) throw err;
			res.render('admin/tags_edit',{data:result[0]});
		});
	});
});

/* 更新标签 */
router.post('/update', (req,res,next) => {
	let id = req.body.id;
	let title = req.body.title;
	MongoClient.connect(url, (err,db) => {
		if (err) throw err;
		let tags = db.collection('tags');
		tags.update({_id:ObjectId(id)}, {title: title}, (err,result) => {
			if (err) {
				res.render('admin/message',{message:'更新标签失败！'});
			} else {
				res.render('admin/message',{message:'更新标签成功！'});
			}
		});
	});
});

/* 删除标签 */
router.get('/delete', (req,res,next) => {
	let id = req.query.id;
	MongoClient.connect(url, (err,db) => {
		if (err) throw err;
		let tags = db.collection('tags');
		tags.remove({_id:ObjectId(id)}, (err,result) => {
			if (err) {
				res.render('admin/message',{message:'删除标签失败！'});
			} else {
				res.render('admin/message',{message:'删除标签成功！'});				
			}
		});
	});
});

module.exports = router;