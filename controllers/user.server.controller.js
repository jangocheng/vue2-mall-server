var mongoose = require('mongoose');
var User = mongoose.model('User');

/* ************
 * req 请求对象
 * res 响应对象
 * next 继续执行
 * ************/
var userControoler = {
    login(req, res, next) {
        console.log(req.body);
        var user = {
            userName: req.body.username,
            passWord: req.body.password
        };

        User.findOne(user, function (err, docs) {
            if (err) {
                res.end('登录 => Error');
                return next();
            } else {
                console.log(docs);
                var data = { code: 20000, data: { token: docs['_id'] } }
                res.json(data);
            }
        })
        // var user = new User({
        //     userName: req.body.username,
        //     passWord: req.body.password
        // });

        // user.save(function (err) {
        //     if (err) {
        //         res.end('Error');
        //         return next();
        //     } else {
        //         User.find({}, function (err, docs) {
        //             if (err) {
        //                 res.end('Error');
        //                 return next();
        //             }
        //             var data = { code: 20000, data: { token: 'admin' } }
        //             res.json(data);
        //         });
        //     }
        // });
    },
    getUserInfo(req, res, next) {
        console.log(req.query);
        User.findOne({ '_id': req.query.token }, function (err, docs) {
            if (err) {
                res.end('获取用户信息 => Error');
                return next();
            } else {
                console.log('用户信息 =>' + JSON.stringify(docs));
                var data = {
                    "code": 20000,
                    "data": {
                        "role": [
                            docs.userName
                        ],
                        "name": docs.userName,
                        "avatar": "/images/DDD.jpg"
                    }
                }
                res.json(data);
            }
        });
    },
    logout(req, res, next) {
        console.log("登出 =>" + JSON.stringify(req.body));
        var data = { "code": 20000, "data": "success" }
        res.json(data);
    },
};

module.exports = userControoler;