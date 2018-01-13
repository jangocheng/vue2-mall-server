var express = require('express');
var router = express.Router();

var district = require('../controllers/district.server.controller');

// 所有省份
router.get('/list', district.provinces);
// 所有城市
router.get('/city', district.city);
// 所有区域
router.get('/area', district.area);
module.exports = router;