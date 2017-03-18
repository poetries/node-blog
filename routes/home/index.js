var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home/index',{title: '张雄的个人网站'});
});

module.exports = router;
