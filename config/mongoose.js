var mongoose = require('mongoose');
var config = require('./config.js');

module.exports = function () {
    // 连接数据库
    var db = mongoose.connect( config.mongodb );
    db.connection.on("error", function (error) {
        console.log("数据库连接失败：" + error);
    });
    db.connection.on("open", function () {
        console.log("——数据库连接成功！——");
    });
    
    require('../models/goods.server.model');
    // 返回数据库实例
    return db;
};