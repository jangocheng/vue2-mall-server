let mongoose = require('mongoose');
let User = mongoose.model('User');

let UserControllers = {
    login(req, res, next) {
        let params = {
            user_name: req.body.username,
            user_password: req.body.password
        }
        User.findOne(params, (err, docs) => {
            if (err) {
                return next();
            } else {
                if (docs) {
                    res.json({
                        code: 200,
                        msg: '登录成功',
                        result: {
                            userName: docs.user_name,
                            userId: docs.user_id
                        }
                    });
                } else {
                    res.json({ code: 100, msg: '账号或密码错误', result: {} })
                }
            }
        });
    }
}

module.exports = UserControllers;