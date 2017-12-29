let mongoose = require('mongoose');
let GoodsList = mongoose.model('GoodsList');
let User = mongoose.model('User');
let GoodsDetail = mongoose.model('GoodsDetail');

let GoodsController = {
    // 获取商品列表
    getGoods(req, res, next) {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize);
        let sort = req.query.sort; // 1升序 -1降序
        let skip = (page - 1) * pageSize;
        console.log(req.query);
        // let params = {salePrice: { $gt: 0, $lte: 500 } } // 按价格查询
        let GoodsListModel = GoodsList.find({}).skip(skip).limit(pageSize);
        GoodsListModel.sort({ 'sale_price': sort });
        GoodsListModel.exec(function (err, docs) {
            if (err) {
                res.json({ code: 0, msg: err.message });
                return next();
            } else {
                let data = { code: 200, msg: '成功', result: { count: docs.length, list: docs } }
                res.json(data)
            }
        });
    },
    // 获取商品详情
    getDetail(req, res, next) {
        let goodsId = req.query.id;
        let params = { product_id: parseInt(goodsId) };
        GoodsDetail.findOne(params, function (err, docs) {
            if (err) {
                res.json({ code: 0, msg: err.message })
                return next();
            } else {
                let data = { code: 200, msg: '成功', result: docs }
                // res.sendStatus(200)
                res.json(data);
            }
            // console.log(docs);
        })
        // console.log(req.query);
    },
    // 添加商品到购物车
    addCart(req, res, next) {
        // console.log(req.body.product_id);
        let userId = '930910';
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
                                // console.log('DDD=>' + docs2);
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
    }
};

module.exports = GoodsController;