// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function (fmt) { // author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

Date.prototype.MaxDayOfDate = function () {
    var myDate = this;
    var ary = myDate.toArray();
    var date1 = (new Date(ary[0], ary[1], 1));
    var date2 = date1.DateAdd('m', 1);
    var result = (date2 - date1) / (24 * 3600 * 1000);
    return result;
};


Date.prototype.thisweek = function (format, interval) { //interval为正数时，取后几周
    var date = new Date(Date.parse(format.replace(/-/g, "/")));
    var weekday = date.getDay();
    var firstday = date.getIntervalDate(format, 0 - (weekday - interval * 7));
    var lastday = date.getIntervalDate(format, 6 - (weekday - interval * 7));
    return firstday + "~" + lastday;
};


Date.prototype.thismonth = function (format) {
    var date = new Date(Date.parse(format.replace(/-/g, "/")));
    var MaxDayOfDate = date.MaxDayOfDate();
    var ary = date.toArray();
    var firstday = (new Date(ary[0], ary[1], 1)).format("yyyy-MM-dd");
    var lastday = (new Date(ary[0], ary[1], MaxDayOfDate)).format("yyyy-MM-dd");
    return firstday + "~" + lastday;
};


Date.prototype.getmonth = function (format, interval) { //interval为正数时，取后几月
    var date = new Date(Date.parse(format.replace(/-/g, "/")));
    date.setMonth(date.getMonth() + interval);
    var MaxDayOfDate = date.MaxDayOfDate();
    var ary = date.toArray();
    var firstday = (new Date(ary[0], ary[1], 1)).format("yyyy-MM-dd");
    var lastday = (new Date(ary[0], ary[1], MaxDayOfDate)).format("yyyy-MM-dd");
    return firstday + "~" + lastday;
};


Date.prototype.getIntervalDate = function (date, interval) {
    // 获取系统时间
    var baseDate = new Date(Date.parse(date.replace(/-/g, "/")));
    var baseYear = baseDate.getFullYear();
    var baseMonth = baseDate.getMonth();
    var baseDate = baseDate.getDate();
    // 处理
    var newDate = new Date(baseYear, baseMonth, baseDate);
    newDate.setDate(newDate.getDate() + interval); // 取得系统时间的相差日期,interval 为负数时是前几天,正数时是后几天
    var temMonth = newDate.getMonth();
    temMonth++;
    var lastMonth = temMonth >= 10 ? temMonth : ("0" + temMonth);
    var temDate = newDate.getDate();
    var lastDate = temDate >= 10 ? temDate : ("0" + temDate);
    //得到最终结果
    newDate = newDate.getFullYear() + "-" + lastMonth + "-" + lastDate;
    return newDate;
};


Date.prototype.DateAdd = function (strInterval, Number) {
    var dtTmp = this;
    switch (strInterval) {   
        case 's' :return new Date(Date.parse(dtTmp) + (1000 * Number));  
        case 'n' :return new Date(Date.parse(dtTmp) + (60000 * Number));  
        case 'h' :return new Date(Date.parse(dtTmp) + (3600000 * Number));  
        case 'd' :return new Date(Date.parse(dtTmp) + (86400000 * Number));  
        case 'w' :return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));  
        case 'q' :return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number*3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());  
        case 'm' :return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());  
        case 'y' :return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());  
    }
};


Date.prototype.toArray = function () {
    var myDate = this;
    var myArray = Array();
    myArray[0] = myDate.getFullYear();
    myArray[1] = myDate.getMonth();
    myArray[2] = myDate.getDate();
    myArray[3] = myDate.getHours();
    myArray[4] = myDate.getMinutes();
    myArray[5] = myDate.getSeconds();
    return myArray;
};

module.exports = {};