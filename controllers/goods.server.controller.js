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
        console.log(req.query);
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
    },
    
};

module.exports = GoodsController;