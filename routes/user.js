var express = require('express');
var router = express.Router();
var isAuthenticated = require('../middlewares/auth.service');

var user = require('../controllers/user.server.controller');

// 登录
router.post('/login', user.login);
// 登出
router.post('/logout', user.logout);
// 查询用户登录状态
router.get('/checkLogin', isAuthenticated, user.checkLogin);
// 获取用户收货地址
router.get('/address', isAuthenticated, user.getAddress);
// 设置默认收货地址
router.post('/setDefault', isAuthenticated, user.setDefault);
// 删除收货地址
router.post('/removeAddress', isAuthenticated, user.removeAddress);
// 新增收货地址
router.post('/addAddress', isAuthenticated, user.addAddress);
// 购物车列表
router.post('/cartList', isAuthenticated, user.getCartList);
// 商品加入购物车
router.post('/addCart', isAuthenticated, user.addCart);
// 编辑购物车
router.post('/cartEdit', isAuthenticated, user.editCart);
// 删除购物车商品
router.post('/cartDelete', isAuthenticated, user.deleteCart);
// 获取购物车数量
router.get('/getCartCount', isAuthenticated, user.getCartCount);
// 生成订单
router.post('/payMent', isAuthenticated, user.payMent);

module.exports = router;