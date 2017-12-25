/*************************
 * 命名规则
 * user   用户Model
 * server 服务器端Model
 * model  表明是一个Model
 * js     文件名
 *************************/
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    userName: { type: String, require: true },// 不可为空约束
    passWord: { type: String, require: true },
    LoastLogin: { type: Date, default: Date.now }
});

// 返回另一个Model实例 [Users就是表名 MongooDB会自动加上s => 表名变成复数]
mongoose.model('User', UserSchema);