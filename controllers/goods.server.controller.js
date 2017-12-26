let mongoose = require('mongoose');
let GoodsList = mongoose.model('GoodsList');

let GoodsController = {
    getGoods(req, res, next) {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize);
        let sort = req.query.sort; // 1升序 -1降序
        let skip = (page - 1) * pageSize;
        console.log(req.query);
        let GoodsListModel = GoodsList.find({}).skip(skip).limit(pageSize);
        GoodsListModel.sort({'salePrice': sort});
        GoodsListModel.exec(function (err, docs) {
            if (err) {
                res.json({ code: 0, msg: err.message });
                return next();
            } else {
                let data = { code: 200, msg: '成功', result: { count: docs.length, list: docs } }
                res.json(data)
            }
        });
    }
};

module.exports = GoodsController;