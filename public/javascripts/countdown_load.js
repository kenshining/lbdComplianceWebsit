var countdown_options = {
    server_time: '',
    auto_bid_time: '',
    manual_bid_time: '',
    callback: ''
};
var CountDown = function(options) {
        var self = this;
        self.settings = options;
        self.server_time = self.convertDate(options.server_time);
        self.auto_bid_time = self.convertDate(options.auto_bid_time);
        self.manual_bid_time = self.convertDate(options.manual_bid_time);
        self.callback = options.callback;
        self.tag = false;
};
//字符串转成时间
CountDown.prototype.convertDate = function(date) {
    return new Date(date.replace(/-/g, "/"));
};
//时间转成字符串
CountDown.prototype.date2str = function(x, y) {
    var z = {
        y: x.getFullYear(),
        M: x.getMonth() + 1,
        d: x.getDate(),
        h: x.getHours(),
        m: x.getMinutes(),
        s: x.getSeconds()
    };
    return y.replace(/(y+|M+|d+|h+|m+|s+)/g, function(v) {
        return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-(v.length > 2 ? v.length : 2));
    });
};
/* 
 * 获得时间差,时间格式为 年-月-日 小时:分钟:秒 或者 年/月/日 小时：分钟：秒
 * 其中，年月日为全格式，例如 ： 2010-10-12 01:00:00
 * 返回精度为：秒，分，小时，天
 */
CountDown.prototype.GetDateDiff = function(startTime, endTime, diffType) {
    var time_array = [];
    var time_end = endTime.getTime();
    var time_now = startTime; // 获取当前时间
    time_now = time_now.getTime();
    var time_distance = time_end - time_now; // 时间差：活动结束时间减去当前时间  
    var int_day, int_hour, int_minute, int_second;
    if (time_distance >= 0) {
        // 相减的差数换算成天数  
        int_day = Math.floor(time_distance / 86400000);
        time_distance -= int_day * 86400000;
        // 相减的差数换算成小时
        int_hour = Math.floor(time_distance / 3600000);
        time_distance -= int_hour * 3600000;
        // 相减的差数换算成分钟  
        int_minute = Math.floor(time_distance / 60000);
        time_distance -= int_minute * 60000;
        // 相减的差数换算成秒数 
        int_second = Math.floor(time_distance / 1000);
        // 判断小时小于10时，前面加0进行占位
        if (int_hour < 10) int_hour = "0" + int_hour;
        // 判断分钟小于10时，前面加0进行占位     
        if (int_minute < 10) int_minute = "0" + int_minute;
        // 判断秒数小于10时，前面加0进行占位
        if (int_second < 10) int_second = "0" + int_second;
        // 显示倒计时效果      
        time_array.push(int_day);
        time_array.push(int_hour);
        time_array.push(int_minute);
        time_array.push(int_second);
    }
    return time_array;
};
CountDown.prototype.showTime = function() {
    var self = this; 
    if (self.server_time <= self.auto_bid_time) {
        var d1 = self.GetDateDiff(self.server_time, self.auto_bid_time);
        //console.log(d1.join('-'));
        if (typeof(self.callback) == 'function') {
            self.callback({
                type: '1',
                data: d1
            });
            self.tag = true;
        } 
    } else if (self.server_time > self.auto_bid_time && self.server_time <= self.manual_bid_time) {
        var d2 = self.GetDateDiff(self.server_time, self.manual_bid_time);
        //console.log(d2.join('#'));
        if (typeof(self.callback) == 'function') {
            self.callback({
                type: '2',
                data: d2
            });
            self.tag = true;
        } 
    } 
};
CountDown.prototype.start = function() {
    //如果服务器当前时间小于auto_bid_time,开始自动投标倒计时
    //否则大于auto_bid_time,小于manual_bid_time,开始手动投标倒计时
    //否则结束倒计时
    var self = this;
    if (self.server_time > self.manual_bid_time) {
        if (self.timer) clearTimeout(self.timer);
        if (typeof(self.callback) == 'function') {
            self.callback({
                type: '3',
                data: ""
            });
        }
    } else {
        self.showTime();
        self.server_time = new Date(self.server_time.valueOf() + 1000);
        self.timer = setTimeout(function() {
            self.start();
        }, 1000);
    }
};
/*
var countdown_options = {
    server_time: '2014/10/11 11:00:00',
    auto_bid_time: '2014/10/11 11:00:10',
    manual_bid_time: '2014/10/11 11:00:20',
    callback: ''
};
var s=new CountDown(countdown_options);
s.start()
 */
