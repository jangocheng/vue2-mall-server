let mongoose = require('mongoose');
let User = mongoose.model('User');
let GoodsList = mongoose.model('GoodsList');

let UserControllers = {
    // 登录
    login(req, res, next) {
        console.log(req.body);
        let params = {
            user_name: req.body.username,
            user_password: req.body.password
        }
        User.findOne(params, (err, docs) => {
            if (err) {
                return next();
            } else {
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
                    res.json({ code: 100, msg: '账号或密码错误', result: {} })
                }
            }
        });
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
        let userId = req.headers.authorization;
        if (userId) {
            res.json({ code: 200, msg: '用户已登录', result: '' });
        } else {
            res.json({ code: 100, msg: '用户未登录', result: '' });
        }
    },
    // 获取用户收货地址
    getAddress(req, res, next) {
        console.log(req.headers.authorization);
        let params = { user_id: req.headers.authorization }
        User.findOne(params, function (err, docs) {
            if (err) {
                return next();
            } else {
                // console.log(docs);
                res.json({ code: 200, msg: '成功', result: docs.address_list })
            }
        })
    },
    // 设置默认收货地址
    setDefault(req, res, next) {
        console.log(req.body);
        let userId = req.headers.authorization;
        var addressId = req.body.address_id;
        if (!addressId) {
            res.json({ code: 200, msg: '地址id为空', result: '' })
        } else {
            User.findOne({ user_id: userId }, function (err, docs) {
                if (err) {
                    return next();
                } else {
                    var addressList = docs.address_list;
                    addressList.map((item, index) => {
                        if (item.address_id == addressId) {
                            item.is_default = true;
                        } else {
                            item.is_default = false;
                        }
                    });
                    docs.save(function (err1, docs) {
                        if (err) {
                            return next();
                        } else {
                            res.json({ code: 200, msg: '默认地址设置成功', result: '' });
                        }
                    })
                }
            })
        }
    },
    // 删除收货地址
    removeAddress(req, res, next) {
        console.log(req.body);
        let userId = req.headers.authorization;
        let addressId = { address_id: req.body.addressId }
        if (!req.body.addressId) {
            res.json({ code: 200, msg: '缺少addressId参数', result: '' });
        } else {
            User.update(
                { user_id: userId },
                { $pull: { address_list: addressId } },
                function (err, docs) {
                    if (err) {
                        return next();
                    } else {
                        // console.log(docs);
                        res.json({ code: 200, msg: '删除成功', result: docs });
                    }
                }
            );
        }
    },
    // 添加商品到购物车
    addCart(req, res, next) {
        // console.log(req.body.product_id);
        let userId = req.headers.authorization;
        let productId = req.body.product_id;
        User.findOne({ user_id: userId }, function (err, userDocs) {
            if (err) {
                res.json({ code: 200, msg: err.message })
            } else {
                // console.log('User' + docs);
                if (userDocs) {
                    let goodsItem = '';
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
        let param = { user_id: req.body.user_id }
        User.findOne(param, function (err, docs) {
            if (err) {
                res.json({ code: 200, msg: err.message })
                return next()
            } else {
                if (docs) {
                    res.json({ code: 200, msg: '成功', result: docs.cart_list })
                }
                // console.log(docs);
            }
        })
    },
    // 编辑购物车内的商品
    editCart(req, res, next) {
        console.log(req.body);
        let userId = req.headers.authorization;
        let productId = req.body.product_id;
        let productNum = req.body.product_number;
        User.update(
            { 'user_id': userId, 'cart_list.product_id': productId },
            { 'cart_list.$.product_number': productNum }, // $ 占位符
            function (err, docs) {
                if (err) {
                    return next();
                } else {
                    res.json({ code: 200, msg: '编辑成功', result: '' })
                }
            }
        );
    },
    // 删除购物车商品
    deleteCart(req, res, next) {
        let userId = req.headers.authorization;
        let productId = { product_id: req.body.product_id }
        console.log(req.body)
        // $pull 删除
        User.update(
            { user_id: userId },
            { $pull: { cart_list: productId } },
            function (err, docs) {
                if (err) {
                    return next();
                } else {
                    res.json({
                        code: 200,
                        msg: '删除成功',
                        result: ''
                    })
                }
            }
        );
    },
    // 购物车数量
    getCartCount(req, res, next) {
        console.log(req.query);
        let userId = req.headers.authorization;
        if (userId) {
            User.findOne({ user_id: userId }, function (err, docs) {
                if (err) {
                    return next();
                } else {
                    let cartCount = 0;
                    docs.cart_list.forEach(item => {
                        cartCount += parseInt(item.product_number);
                    });
                    res.json({ code: 200, msg: '获取购物车数量成功', result: { cartCount: cartCount } })
                    // console.log(cartCount);
                }
            });
        } else {
            res.json({ code: 200, msg: '查询购物车数量时缺少用户Id', result: '' })
        }
    }
}

module.exports = UserControllers;