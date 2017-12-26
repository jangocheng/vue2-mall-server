/*************************
 * 命名规则
 * user   用户Model
 * server 服务器端Model
 * model  表明是一个Model
 * js     文件名
 *************************/
var mongoose = require('mongoose');

var ListSchema = new mongoose.Schema({
    author: String,
    display_time: { type: Date, default: Date.now },
    pageviews: Number | String,
    status: Number | String,
    title: String
});

// 返回另一个Model实例 [Lists 就是表名 MongooDB会自动加上s => 表名变成复数]
mongoose.model('List', ListSchema);
