const express = require('express');
const router = express.Router();

router.get('/', (req,res,next) => {
	res.render('home/about.ejs',{title: "关于我"});
});

module.exports = router;