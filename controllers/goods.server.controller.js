var mongoose = require('mongoose');
var GoodsList = mongoose.model('GoodsList');
var User = mongoose.model('User');
var GoodsDetail = mongoose.model('GoodsDetail');

var GoodsController = {
    // 获取商品列表
    getGoods(req, res, next) {
        var page = parseInt(req.query.page);
        var pageSize = parseInt(req.query.pageSize);
        var sort = req.query.sort || 1; // 1升序 -1降序
        var skip = (page - 1) * pageSize; // 跳过多少条
        console.log(req.query);
        // var params = {sale_price: { $gt: 0, $lte: 500 } } // 按价格查询 [0 - 500]
        var GoodsListModel = GoodsList.find({}).skip(skip).limit(pageSize);
        GoodsListModel.sort({ 'sale_price': sort });
        GoodsListModel.exec(function (err, docs) {
            if (err) {
                res.json({ code: 0, msg: err.message });
                return next();
            } else {
                var data = { code: 200, msg: '成功', result: { count: docs.length, list: docs } }
                res.json(data)
            }
        });
    },
    // 获取商品详情
    getDetail(req, res, next) {
        console.log(req.query);
        var goodsId = req.query.id;
        var params = { product_id: parseInt(goodsId) };
        GoodsDetail.findOne(params, function (err, docs) {
            if (err) {
                res.json({ code: 0, msg: err.message })
                return next();
            } else {
                var data = { code: 200, msg: '成功', result: docs }
                // res.sendStatus(200)
                res.json(data);
            }
            // console.log(docs);
        });
    },
    
};

module.exports = GoodsController;