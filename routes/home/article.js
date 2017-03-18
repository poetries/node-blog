const express = require('express');
const router = express.Router();
const ObjectId = require('objectid');

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/blog';

/* GET article page. */
router.get('/', (req,res,next) => {
	let id = req.query.id;
	MongoClient.connect(url, (err,db)=>{
		if(err) throw err;
		let posts = db.collection('posts');
		posts.find({_id : ObjectId(id)}).toArray((err,result)=>{
			if(err) throw err;
			let article = {
				title : result[0].title,
				tag : result[0].tag,
				content : result[0].content,
				wmdy : result[0].wmdy
			};
			res.render('home/article',{data:article, title:article.title});
		});
	});
});

module.exports = router;