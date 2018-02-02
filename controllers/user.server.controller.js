var mongoose = require('mongoose');
var User = mongoose.model('User');
var GoodsList = mongoose.model('GoodsList');
var GoodsDetail = mongoose.model('GoodsDetail');
require('../utils/dateFormat');

var UserControllers = {
    /***********************************
     * @name 登录
     * @author DDD
     * @param {username} 用户名
     * @param {password} 密码
     ***********************************/
    login(req, res, next) {
        console.log(req.body);
        var params = {
            user_name: req.body.username,
            user_password: req.body.password
        }
        User.findOne(params)
            .then(function (docs) {
                if (docs) {
                    res.json({
                        code: 200,
                        msg: '登录成功',
                        result: {
                            userName: docs.user_name,
                            userId: docs.user_id
                        }
                    });
                } else {
                    res.json({ code: 400, msg: '账号或密码错误', result: '' });
                }
            })
            .catch(function(err) {
                // 处理error
                res.json({ code: 400, msg: 'Error:' + err.message, result: '' });
            })
    },

    // 登出
    logout(req, res, next) {
        res.json({ code: 200, msg: '登出成功', result: '' });
    },

    // 查询用户登录状态
    checkLogin(req, res, next) {
        console.log(req.headers.authorization);
        var userId = req.headers.authorization;
        
        if (userId) {
            res.json({ code: 200, msg: '用户已登录', result: '' });
        } else {
            res.json({ code: 100, msg: '用户未登录', result: '' });
        }
    },

    // 获取用户收货地址
    getAddress(req, res, next) {
        console.log(req.headers.authorization);
        var userId = req.headers.authorization
        // if (!req.headers.authorization) return next();

        var params = { user_id: userId }
        User.findOne(params)
            .then(function (docs) {
                // docs.address_list.map((item, index) => {
                //     var provinces_id = item.provinces_id;
                // });
                res.json({ code: 200, msg: '成功', result: docs.address_list });
            })
            .catch(function (err) {
                // 处理error
                res.json({ code: 200, msg: 'Error:' + err.message, result: '' });
            })
    },

    // 设置默认收货地址
    setDefault(req, res, next) {
        var userId = req.headers.authorization;
        console.log(userId);
        // if (!userId) return next();

        var addressId = req.body.address_id;
        if (!addressId) {
            res.json({ code: 200, msg: '地址id为空', result: '' });
            return next();
        } else {
            User.findOne({ user_id: userId })
                .then(function (docs) {
                    var addressList = docs.address_list;
                    addressList.map((item, index) => {
                        if (item.address_id == addressId) {
                            item.is_default = true;
                        } else {
                            item.is_default = false;
                        }
                    });
                    return docs.save();
                })
                .then(function (docs) {
                    res.json({ code: 200, msg: '默认地址设置成功', result: '' });
                })
                .catch(function (err) {
                    // 处理error
                    res.json({ code: 200, msg: 'Error:' + err.message, result: '' });
                })
                // .finally(function (docs) {
                //     // 最终执行代码
                // })
        }
    },

    /***********************************
     * @name 删除收货地址
     * @author DDD
     * @param {authorization} 用户id
     * @param {addressId} 地址id
     * @param {is_default} 是否删除默认地址
     ***********************************/
    removeAddress(req, res, next) {
        console.log(req.body);
        var userId    = req.headers.authorization;
        var addressId = { address_id: req.body.addressId };
        var isDefault = { is_default: req.body.is_default };
        if (!req.body.addressId) {
            res.json({ code: 200, msg: '缺少addressId参数', result: '' });
            return;
        }

        // 这里还需要判断是否删除的是默认地址
        // 删除默认地址后需要设置一个默认值
        User.update(
            { user_id: userId },
            { $pull: { address_list: addressId } }
        )
        .then(function (docs) {
            if (isDefault) {
                console.log('DDD' + JSON.stringify(docs));
                // docs[0].is_default = isDefault;
            }
            res.json({ code: 200, msg: '删除成功', result: docs });
        })
        .catch(function (err) {
            res.json({ code: 200, msg: err.message, result: '' });
        })
    },

    /***********************************
     * @name 新增收货地址
     * @author DDD
     * @param {authorization} 用户id
     * @param {consignee_name} 收货人姓名
     * @param {street_address} 收货人地址
     * @param {phone} 收货人联系电话
     * @param {is_default} 是否设为默认地址
     ***********************************/
    addAddress(req, res, next) {
        var userId        = req.headers.authorization;
        var consigneeName = req.body.consigneeName; // 收货人姓名
        var provincesId   = req.body.provincesId; // 省份id
        var cityId        = req.body.cityId; // 城市id
        var areaId        = req.body.areaId; // 区域id
        var streetAddress = req.body.streetAddress; // 详细地址
        var phone         = parseInt(req.body.phone); // 手机号码
        var isDefault     = req.body.isDefault; // 是否设为默认

        console.log(req.body);
        // return;
        if (userId && consigneeName && streetAddress && phone) {
            User.findOne({ user_id: userId })
                .then(function (docs) {
                    // 如果用户设为默认其他的都设为false
                    if (isDefault) {
                        docs.address_list.map((item, index) => {
                            item.is_default = false
                        });
                    }

                    // 新增地址
                    docs.address_list.push({
                        address_id: docs.address_list.length + 1, // 地址id自增
                        consignee_name: consigneeName, // 收货人姓名
                        provinces_id: provincesId, // 省份id
                        city_id: cityId, // 城市id
                        area_id: areaId, // 区域id
                        street_address: streetAddress, // 详细地址
                        postCode: 1, // 邮政编码
                        phone: phone, // 手机号码
                        is_default: isDefault, // 是否默认
                    });

                    return docs.save();
                })
                .then(function (docs) {
                    res.json({ code: 200, msg: '添加成功!' });
                })
                .catch(function (err) {
                    res.json({ code: 200, msg: err.message, result: '' });
                })
        } else {
            res.json({ code: 400, msg: '缺少参数' });
        }
    },

    // 添加商品到购物车
    addCart(req, res, next) {
        console.log(req.body);
        var userId          = req.headers.authorization;
        var productId       = req.body.product_id; // 商品id
        var specificationId = req.body.specification_id; // 商品规格id
        var quantity        = parseInt(req.body.pur_quantity); // 商品数量

        User.findOne({ user_id: userId })
            .then(function (userDocs) {
                if (!userDocs) return next();
                var goodsItem = '';
                userDocs.cart_list.map((item, index) => {
                    if (item.product_id == productId) {
                        goodsItem = item;
                        // 增加的商铺数量
                        item.product_number += quantity;
                    }
                });

                // 判断购物车里是否存在当前添加的商品
                if (goodsItem) {
                    console.log('购物车里已经有了');
                    // 购物车已有时叠加
                    return userDocs.save();
                } else {
                    // 购物车没有时新增[GoodsDetail模型]
                    var specification = '';
                    GoodsDetail.findOne({ product_id: productId })
                        .then(function (docs) {
                            if (docs.specification.length == 1) {
                                specification = docs.specification[0];
                            } else {
                                docs.specification.map((item, index) => {
                                    if (item.id == specificationId) {
                                        specification = item
                                    }
                                });
                            }
                            var schema = {
                                product_id: docs.product_id,
                                product_name: docs.title,
                                checked: 1,
                                product_number: quantity,
                                specification: specification
                            };
                            userDocs.cart_list.push(schema);
                            return userDocs.save();
                        })
                        .catch(function (err) {
                            res.json({ code: 200, msg: err.message, result: '' });
                        })
                }
            })
            .then(function (docs) {
                res.json({ code: 200, msg: '已添加到购物车' });
            })
            .catch(function (err) {
                // 处理error
                res.json({ code: 200, msg: 'Error:' + err.message, result: '' });
            })
    },

    // 购物车列表
    getCartList(req, res, next) {
        var userId = req.headers.authorization;
        console.log(req.headers.authorization);

        User.findOne({ user_id: userId })
            .then(function (docs) {
                if (docs) {
                    res.json({ code: 200, msg: '成功', result: docs.cart_list });
                }
            })
            .catch(function (err) {
                res.json({ code: 200, msg: err.message });
            })
    },

    // 编辑购物车内的商品
    editCart(req, res, next) {
        console.log(req.body);
        var userId     = req.headers.authorization;
        var productId  = req.body.product_id;
        var productNum = req.body.product_number;

        User.update(
            { 'user_id': userId, 'cart_list.product_id': productId },
            { 'cart_list.$.product_number': productNum }, // $ 占位符
        ).then(function (docs) {
            console.log(docs);
            res.json({ code: 200, msg: '编辑成功', result: '' });
        }).catch(function (err) {
            res.json({ code: 200, msg: err.message });
        })
    },

    // 删除购物车商品
    deleteCart(req, res, next) {
        var userId    = req.headers.authorization;
        var productId = { product_id: req.body.product_id }
        console.log(req.body)

        // $pull 删除
        User.update(
            { user_id: userId },
            { $pull: { cart_list: productId } }
        )
        .then(function (docs) {
            res.json({ code: 200, msg: '删除成功', result: '' });
        })
        .catch(function (err) {
            res.json({ code: 200, msg: err.message });
        })
    },

    // 购物车数量
    getCartCount(req, res, next) {
        console.log(req.query);
        var userId = req.headers.authorization;
        if (!userId) {
            res.json({ code: 200, msg: '查询购物车数量时缺少用户Id', result: '' });
            return;
        }
        User.findOne({ user_id: userId })
            .then(function (docs) {
                var cartCount = 0;
                docs.cart_list.forEach(item => {
                    cartCount += parseInt(item.product_number);
                });
                res.json({ code: 200, msg: '获取购物车数量成功', result: { cartCount: cartCount } });
            })
            .catch(function (err) {
                res.json({ code: 200, msg: err.message });
            })
    },

    // 生成订单
    payMent(req, res, next) {
        var userId     = req.headers.authorization;
        var orderTotal = req.body.order_total; // 订单总金额
        var addressId  = req.body.address_id; // 地址id
        
        User.findOne({ user_id: userId })
            .then(function (docs) {
                var address = '';
                var goodsList = [];
                // 获取当前用户地址信息
                docs.address_list.map(function (item, index) {
                    if (item.address_id == addressId) {
                        address = item;
                    }
                });
                // 获取用户购物车的购买商品
                docs.cart_list.filter(function (item, index) {
                    // checked 等于1时表示选中的商品都需要购买
                    if (item.checked == 1) {
                        goodsList.push(item);
                    }
                });

                // 当前系统架构平台码
                var platform = '628';
                // 随机数
                var r1 = Math.floor(Math.random() * 10);
                var r2 = Math.floor(Math.random() * 10);
                // 系统时间
                var sysDate = new Date().Format('yyyyMMddhhmmss');
                // 订单生成时间
                var creatDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
                var orderId = platform + r1 + sysDate + r2;
                // 需要保存的参数
                var order = {
                    orderId: orderId, // 订单号
                    orderTotal: orderTotal, // 订单总金额
                    addressInfo: address, // 地址信息
                    goodsList: goodsList, // 商品列表
                    orderStatus: 1, // 订单状态
                    createDate: creatDate // 创建时间
                }
                docs.order_list.push(order);
                return docs.save();
            })
            .then(function (order) {
                res.json({ code: 200, msg: '订单生成成功', result: order.order_list });
            })
            .catch(function (err) {
                res.json({ code: 200, msg: err, result: '' });
            })
    }
}

module.exports = UserControllers;