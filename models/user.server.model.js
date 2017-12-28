/*************************
 * 命名规则
 * user   用户Model
 * server 服务器端Model
 * model  表明是一个Model
 * js     文件名
 *************************/
let mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
    user_id: String,
    name: String,
    password: String,
    orderList: Array,
    cart_list: [{
        product_id: String,
        product_name: String,
        salePrice: String,
        product_images: String,
        checked: String,
        product_number: String
    }],
    address_list: Array
});

/**************************************************
 * - 返回另一个 Model 实例 [不写第三个参数时， User 就是表名 MongooDB会自动加上s => 表名变成复数]
 * params1 [Model的名字]
 * params2 [Schema的规则 规定的字段]
 * params3 [数据库的表名]
 **************************************************/
module.exports = mongoose.model('User', UserSchema, 'users');