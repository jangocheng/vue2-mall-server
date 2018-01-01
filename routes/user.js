let express = require('express');
let router = express.Router();

let user = require('../controllers/user.server.controller');

// 登录
router.post('/login', user.login);
// 登出
router.post('/logout', user.logout);
// 查询用户登录状态
router.get('/checkLogin', user.checkLogin);
// 获取用户收货地址
router.get('/address', user.getAddress);
// 设置默认收货地址
router.post('/setDefault', user.setDefault);
// 删除收货地址
router.post('/removeAddress', user.removeAddress);
// 购物车列表
router.post('/cartList', user.getCartList);
// 商品加入购物车
router.post('/addCart', user.addCart);
// 编辑购物车
router.post('/cartEdit', user.editCart);
// 删除购物车商品
router.post('/cartDelete', user.deleteCart);
// 获取购物车数量
router.get('/getCartCount', user.getCartCount);

module.exports = router;