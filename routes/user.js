let express = require('express');
let router = express.Router();

let user = require('../controllers/user.server.controller');

// 登录
router.post('/login', user.login)

module.exports = router;