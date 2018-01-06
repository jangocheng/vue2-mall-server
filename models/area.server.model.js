/*************************
 * 命名规则
 * user   用户Model
 * server 服务器端Model
 * model  表明是一个Model
 * js     文件名
 *************************/
var mongoose = require('mongoose');

var AreaSchema = new mongoose.Schema({
    id: { type: String, require: true },
    fullname: { type: String, require: true }, // 不可为空约束
    city: [{
        fullname: { type: String, require: true },
        area: Array
    }]
});

mongoose.model('AreaList', AreaSchema, 'area_list');