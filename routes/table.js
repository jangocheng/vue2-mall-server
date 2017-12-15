var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/list', function (req, res, next) {
    console.log(req);
    var data = {
        "code": 20000,
        "data": {
            "role": [
                "admin"
            ],
            "name": "admin",
            "avatar": "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif"
        }
    }
    res.json(data);
});

module.exports = router;
