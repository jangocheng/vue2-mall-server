/*************************
 * 命名规则
 * user   用户Model
 * server 服务器端Model
 * model  表明是一个Model
 * js     文件名
 *************************/
let mongoose = require('mongoose');

let GoodsDetailSchema = new mongoose.Schema({
    product_id: String,
    name: String,
    key: String,
    type: String,
    title: String,
    category_id: String,
    category_name: String,
    unit: String,
    status: String,
    status_name: String,
    preview_images: Array,
    images: Array,
    adaptation: Array,
    delivery_tip: String,
    sell_tip: String,
    is_available: String,
    specification: [
        {
            id : Number,
            name : String,
            ver : String,
            price : Number,
            image : String,
            has_stock : Number,
            stock : Number,
            link : String,
            sell_tip : String,
            is_available : Number,
            delivery_tip : String
        }
    ],
    sale_attr: Array
});

/**************************************************
 * - 返回另一个 Model 实例 [不写第三个参数时， User 就是表名 MongooDB会自动加上s => 表名变成复数]
 * params1 [Model的名字]
 * params2 [Schema的规则 规定的字段]
 * params3 [数据库的表名]
 **************************************************/
module.exports = mongoose.model('GoodsDetail', GoodsDetailSchema, 'goods_detail');