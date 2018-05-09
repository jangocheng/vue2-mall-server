'use strict';
var mongoose = require('mongoose');
var config = require('./config.js');

module.exports = function () {
    mongoose.Promise = global.Promise;
    // 连接数据库
    mongoose.connect( config.mongodb, {
        dbName: 'db_my_mall'
    } );
    var db = mongoose.connection;
    db.on('error', function () {
        console.error.bind(console, '数据库连接失败 error:')
    });
    db.once('open', function callback () {
        console.log("—— 数据库连接成功！——");
    });

    // db.connection.on("error", function (error) {
    //     console.log("数据库连接失败：" + error);
    // });
    // db.connection.on("open", function () {
    //     console.log("—— 数据库连接成功！——");
    // });
    
    require('../models/goods.server.model');
    require('../models/goodsDetail.server.model');
    require('../models/user.server.model');
    require('../models/provinces.server.model');
    require('../models/city.server.model');
    require('../models/area.server.model');
    // 返回数据库实例
    return db;
};