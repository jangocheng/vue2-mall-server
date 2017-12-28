let mongoose = require('mongoose');
let GoodsList = mongoose.model('GoodsList');
// let GoodsDetail = mongoose.model('GoodsDetail');

let GoodsController = {
    // 获取商品列表
    getGoods(req, res, next) {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize);
        let sort = req.query.sort; // 1升序 -1降序
        let skip = (page - 1) * pageSize;
        console.log(req.query);
        // let params = {salePrice: { $gt: 0, $lte: 500} } // 按价格查询
        let GoodsListModel = GoodsList.find({}).skip(skip).limit(pageSize);
        GoodsListModel.sort({ 'salePrice': sort });
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
        // GoodsDetail.find({}, function (err, docs) {
        //     if (err) {
        //         res.json({ code: 0, msg: err.message })
        //         return next();
        //     }
        //     let data = { code: 200, msg: '成功', result: { list: docs } }
        //     res.json(data);
        // })
        res.sendStatus(200)
        console.log(req.query);
    },
    // 添加商品到购物车
    addCart(req, res, next) {
        console.log(req.body);
        res.json({ code:200, msg: '已添加到购物车' })
    }
};

module.exports = GoodsController;