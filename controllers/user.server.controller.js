var mongoose = require('mongoose');
var User = mongoose.model('User');
var GoodsList = mongoose.model('GoodsList');

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
        res.json({
            code: 200,
            msg: '登出成功',
            result: ''
        })
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
                res.json({ code: 200, msg: '成功', result: docs.address_list })
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
     ***********************************/
    removeAddress(req, res, next) {
        console.log(req.body);
        var userId = req.headers.authorization;
        var addressId = { address_id: req.body.addressId }
        if (!req.body.addressId) {
            res.json({ code: 200, msg: '缺少addressId参数', result: '' });
            return;
        }

        User.update(
            { user_id: userId },
            { $pull: { address_list: addressId } },
        )
        .then(function (docs) {
            res.json({ code: 200, msg: '删除成功', result: docs });
        })
        .catch(function (err) {
            res.json({ code: 200, msg: err.message, result: '' });
            return next();
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
        var userId = req.headers.authorization;
        var consigneeName = req.body.consigneeName;
        var streetAddress = req.body.streetAddress;
        var phone = parseInt(req.body.phone);
        var isDefault = req.body.isDefault;
        console.log(req.body);
        if (userId && consigneeName && streetAddress && phone) {
            User.findOne({ user_id: userId }, function (err, docs) {
                if (err) {
                    res.json({ code: 200, msg: err.message, result: '' });
                } else {
                    // 如果用户设为默认把数据库中其他的都设为false
                    if (isDefault) {
                        docs.address_list.map((item, index) => {
                            item.is_default = false
                        });
                    }
                    docs.address_list.push({
                        address_id: docs.address_list.length + 1,
                        consignee_name: consigneeName,
                        street_address: streetAddress,
                        postCode: 1,
                        phone: phone,
                        is_default: isDefault,
                    });
                    docs.save(function (err2, docs2) {
                        if (err2) {
                            res.json({ code: 200, msg: err.message });
                        } else {
                            res.json({ code: 200, msg: '添加成功!' });
                        }
                    });
                    // console.log(docs.address_list);
                }
            });
        } else {
            res.json({ code: 400, msg: '缺少参数' });
        }
    },

    // 添加商品到购物车
    addCart(req, res, next) {
        // console.log(req.body.product_id);
        var userId = req.headers.authorization;
        var productId = req.body.product_id;
        User.findOne({ user_id: userId }, function (err, userDocs) {
            if (err) {
                res.json({ code: 200, msg: err.message })
            } else {
                // console.log('User' + docs);
                if (userDocs) {
                    var goodsItem = '';
                    userDocs.cart_list.map((item, index) => {
                        if (item.product_id == productId) {
                            goodsItem = item;
                            item.product_number++;
                        }
                    })
                    if (goodsItem) {
                        console.log('购物车里已经有了');
                        userDocs.save(function (err3, docs3) {
                            if (err3) {
                                res.json({ code: 200, msg: err.message })
                            } else {
                                res.json({ code: 200, msg: '已添加到购物车' })
                            }
                        });
                    } else {
                        GoodsList.findOne({ product_id: productId }, function (err2, docs2) {
                            if (err2) {
                                res.json({ code: 200, msg: err.message });
                            } else {
                                if (docs2) {
                                    docs2.product_number = 1;
                                    docs2.checked = 1;
                                    userDocs.cart_list.push(docs2)
                                    // User.cart_list.push(docs2);
                                    userDocs.save(function (err3, docs3) {
                                        if (err3) {
                                            res.json({ code: 200, msg: err.message })
                                        } else {
                                            res.json({ code: 200, msg: '已添加到购物车' })
                                            // console.log('DDD=>' + docs2);
                                        }
                                    });
                                }
                            }
                        })
                    }
                }
            }
        })
    },

    // 购物车列表
    getCartList(req, res, next) {
        // var param = { user_id: req.body.user_id }
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
        var userId = req.headers.authorization;
        var productId = req.body.product_id;
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
        var userId = req.headers.authorization;
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
}

module.exports = UserControllers;