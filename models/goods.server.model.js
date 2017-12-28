/*************************
 * 命名规则
 * user   用户Model
 * server 服务器端Model
 * model  表明是一个Model
 * js     文件名
 *************************/
let mongoose = require('mongoose');

let GoodsListSchema = new mongoose.Schema({
    product_id: String,
    product_name: String,
    sale_price: Number,
    checked: String,
    product_number: Number,
    product_image: String
});

// let GoodsDetailSchema = new mongoose.Schema({
//     productId: String,
//     type: String
// })

// 返回另一个Model实例 [GoodsList 就是表名 MongooDB会自动加上s => 表名变成复数]
mongoose.model('GoodsList', GoodsListSchema);
// mongoose.model('GoodsDetail', GoodsDetailSchema);