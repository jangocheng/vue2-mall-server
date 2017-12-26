var mongoose = require('mongoose');
var List = mongoose.model('List');

/* ************
 * req 请求对象
 * res 响应对象
 * next 继续执行
 * ************/
var tableController = {
    getList(req, res, next) {
        List.find({}, function (err, docs) {
            if (err) {
                res.end('Error');
                return next();
            } else {
                var data = {
                    "code": 20000,
                    "data": {
                        "items": docs
                    }
                }
                res.json(data);
            }
        })
    },
    addList(req, res, next) {
        console.log(req.body);
        var params = {
            author: req.body.author,
            display_time: req.body.displayTime,
            pageviews: req.body.pageviews,
            status: req.body.status,
            title: req.body.title
        };
        var list = new List(params);

        list.save(function (err) {
            if (err) {
                res.end('Error');
                return next();
            } else {
                // {
                //     "id": "120000197909029446",
                //         "title": "Vxlm mjfmdqyk uqutq sgralvcn nijse qly nedq frbr gypsov dddayjdc.",
                //             "status": "draft",
                //                 "author": "name",
                //                     "display_time": "1971-05-05 10:03:09",
                //                         "pageviews": 4126
                // }
                var data = {
                    "code": 20000,
                    "data": {
                        "items": [params]
                    }
                }
                res.status(200);
                res.json(data);
            }
        });
    }
};

 module.exports = tableController;