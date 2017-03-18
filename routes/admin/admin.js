var express = require('express');
var router = express.Router();

/* GET admin page. */
router.get('/', function(req, res, next) {
  res.render('admin/admin');
});

module.exports = router;
