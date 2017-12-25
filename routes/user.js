var express = require('express');
var router = express.Router();

var user = require('../controllers/user.server.controller')

/* ************
 * req 请求对象
 * res 响应对象
 * next 继续执行
 * ************/
// 登录
router.post('/login', user.login);
// 获取用户信息
router.get('/info', user.getUserInfo);
// 登出
router.post('/logout', user.logout);

module.exports = router;