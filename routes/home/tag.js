const express = require('express');
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/blog';

router.get('/', (req,res,next) => {
	MongoClient.connect(url, (err,db) => {
		if(err) throw err;
		let tags = db.collection('tags');
		tags.find().toArray((err,result1) => {
			if(err) throw err;
			let posts = db.collection('posts');
			posts.find().toArray((err,result2)=>{
				if (err) throw err;
				res.render('home/tag',{tags:result1, posts: result2,title: '标签'});
			});
		});
	});
});

module.exports = router;