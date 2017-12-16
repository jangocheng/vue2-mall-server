var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var List = mongoose.model('List');

/* GET users listing. */
router.get('/list', function (req, res, next) {
    console.log(req);
    var data = {
        "code": 20000,
        "data": {}
    }
    res.json(data);
});

router.post('/add', function (req, res, next) {
    console.log(req.body);
    var list = new List({
        author: req.body.author,
        displayTime: req.body.displayTime,
        pageviews: req.body.pageviews,
        status: req.body.status,
        title: req.body.title
    });

    list.save(function (err) {
        if (err) {
            res.end('Error');
            return next();
        } else {
            var data = { code: 20000, success: "success" }
            res.status(200);
            res.json(data);
        }
    });
});

module.exports = router;
