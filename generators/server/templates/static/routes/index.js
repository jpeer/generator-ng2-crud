var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('index called!');
  res.status(200).send('hello');
});

module.exports = router;
