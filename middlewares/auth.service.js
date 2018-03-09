const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['authorization'];

    if (token) {      
        // 解码 token (验证 secret 和检查有效期（exp）)
        jwt.verify(token, 'app.get(superSecret)', function(err, decoded) {
            if (err) {
                return res.json({ code: 50014, msg: '无效的token.' });
            } else {
                // 如果验证通过，在req中写入解密结果
                req.decoded = decoded;
                
                next(); // 继续下一步路由
            }
        });
    } else {
        
        // 没有拿到token 返回错误 
        return res.status(50008).send({ 
            success: false, 
            msg: '没有找到token.' 
        });
    }
};
