const express = require('express');
const router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
router.get('/', function(req, res) {
  res.render('hjemmeside', { pageTitle: 'hm-produktinfo-api'});
//res.render('hjemmeside')
});

module.exports = router;
