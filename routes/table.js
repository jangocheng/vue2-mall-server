var express = require('express');
var router = express.Router();

var list = require('../controllers/table.server.controller');

// GET users listing.
router.get('/list', list.getList);
// 添加一条列表数据
router.post('/add', list.addList);

module.exports = router;
