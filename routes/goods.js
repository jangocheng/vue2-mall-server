var express = require('express');
var router = express.Router();

var goods = require('../controllers/goods.server.controller');

// GET users listing.
router.get('/', goods.getGoods);

module.exports = router;
