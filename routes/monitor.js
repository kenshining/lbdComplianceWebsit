var async = require('async');
var httpClient=require('../lib/HttpClient');
/**
* 监控与错误预警收集
**/
exports.init= function(app,serviceInstance,serviceEnumerationInstance,logInfo){
  
  /**跳转我要借款页面**/
  app.get('/monitor/errorLogs', function(req, res){
    var ips = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    var errorData = req.query.data;
    var ipArray = ips.split(":");

    var http = httpClient.init({host:"http://ip.taobao.com/",timeout:20000});
    http.get("service/getIpInfo.php?ip="+ipArray[ipArray.length-1],{},function(jsonObj){
      saveErrorLog(errorData,jsonObj.data.country+jsonObj.data.area+jsonObj.data.region+jsonObj.data.city,jsonObj.data.isp);
      res.json({state:0});

    },function(errorText){
      saveErrorLog(errorData,"Ip Search fail","ISP Search fail");
      res.json({state:0});
    });

  });

  //保存错误信息
  var saveErrorLog = function(errorDatas,locations,isp){
    logInfo.error("------------------------------");
    logInfo.error("浏览器版本："+ errorDatas.userAgent);
    logInfo.error("问题URL："+ errorDatas.url);
    logInfo.error("行："+ errorDatas.line);
    logInfo.error("列："+ errorDatas.col);
    logInfo.error("消息："+ errorDatas.msg);
    logInfo.error("客户地址："+ locations);
    logInfo.error("服务商："+ isp);
    logInfo.error("------------------------------");
  };

};