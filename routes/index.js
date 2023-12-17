var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json(
      {
        databaseURL: process.env.DATABASEURL,
        jwtSecret: process.env.JWT_SECRET,
      }
  )
});

module.exports = router;
