/*************************
 * Schema - [省]
 * 命名规则
 * user   用户Model
 * server 服务器端Model
 * model  表明是一个Model
 * js     文件名
 * id: { type: String, require: true }
 *************************/
var mongoose = require('mongoose');

var ProvinceSchema = new mongoose.Schema({
    provinces_id: { type: Number, require: true },
    fullname: { type: String, require: true }, // 不可为空约束
});

mongoose.model('ProvinceList', ProvinceSchema, 'province_list');