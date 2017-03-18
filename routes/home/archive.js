const express = require('express');
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/blog';

router.get('/', (req,res,next) => {
	MongoClient.connect(url, (err,db) => {
		if(err) throw err;
		let posts = db.collection('posts');
		posts.find().sort({time:-1}).toArray((err,result) => {
			if(err) throw err;
			res.render('home/archive',{data:result, title: '归档'});
		});
	});
});

module.exports = router;