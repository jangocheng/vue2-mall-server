var mongoose = require('mongoose');
// var User = mongoose.model('User');
var ProvinceList = mongoose.model('ProvinceList');
var CityList = mongoose.model('CityList');
var AreaList = mongoose.model('AreaList');

var DistrictController = {
    // 获取省市级
    provinces(req, res, next) {
        // console.log(req);
        ProvinceList.find(function (err, docs) {
            if (err) {
                res.json({ code: 200, msg: 'Error' + err.message });
                return next();
            } else {
                res.json({ code: 200, msg: '获取成功!', result: docs });
            }
        //    console.log(docs); 
        });
    },
    // 获取城市
    city(req, res, next) {
        console.log(req.query);
        var provincesId = req.query.provincesId;
        if (provincesId) {
            CityList.findOne({ provinces_id: parseInt(provincesId) }, function (err, docs) {
                if (err) {
                    res.json({ code: 200, msg: 'Error' + err.message });
                    return next();
                } else {
                    // console.log(docs);
                    res.json({ code: 200, msg: '成功', result: docs });
                }
            })
        } else {
            res.json( {code: 200, msg: '缺少provincesId参数'} );
        }
        
    },
    // 获取区域
    area(req, res, next) {
        console.log(req.query);
        var cityId = req.query.cityId;

        if (cityId) {
            AreaList.findOne({ city_id: cityId }, function (err, docs) {
                if (err) {
                   res.json({ code: 200, msg: 'Error' + err.message });
                   return next();
                } else {
                    // console.log(docs);
                    res.json({ code: 200, msg: '成功', result: docs });
                }
            });
        } else {
            res.json( {code: 200, msg: '缺少cityId参数'} );
        }
    }
}

module.exports = DistrictController;