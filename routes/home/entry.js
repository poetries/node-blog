const express = require('express');
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/blog';

/* GET entry page. */
router.get('/', (req, res, next)=>{
	MongoClient.connect(url, (err,db) => {
		if(err) throw err;
		let posts = db.collection('posts');
		posts.find().sort({time:-1}).toArray((err,result1) => {
			if(err) throw err;
			let tags = db.collection('tags');
			tags.find().toArray((err,result2)=>{
				if (err) throw err;
				res.render('home/entry',{data:result1, tags: result2,title: '张雄的个人网站'});
			});
		});
	});
});

module.exports = router;