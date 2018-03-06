var config=require('../config/config.json');
var md5=require('./md5');
var tools=require('./tools');

function HttpClient(httpObj){
	this.httpObj=httpObj||{};
	this.http = require('http');
	this.https = require('https');
	this.qs = require('querystring');
	var log4js = require('log4js');
	log4js.configure(config.log4js);
	this.logInfo = log4js.getLogger('logInfo');
	this.url = require('url');
	this.timeout=this.httpObj['timeout']||30000;
}
HttpClient.prototype.access=function(path,datas,type,successFun,errorFun){
	var path=path||this.httpObj['path'];
	var host=this.httpObj['host']||'http://127.0.0.1';
	//var port='80';
	var datas=this.httpObj["datas"]||datas;
	var type=type||this.httpObj['type']||'GET';
	var httpType=this.http;
	if(host.indexOf("https://")>-1){
		httpType=this.https;
	}
	var contentLen=0;
	var content="";
	if(datas){
		content =this.qs.stringify(datas);
		contentLen=content.length;
	}
	var post_option=this.url.parse(host+path);
	post_option.method=type;
	var date=new Date();
	var dateStr=tools.tools.dataFormat(date,"yyyy-MM-dd");
	var key=md5.hex_md5(config.serverKey+dateStr);
	post_option.headers={
        "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',  
        "Content-Length": contentLen,
        "accept":'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
		"accept-language":'zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3',
		"connection":'keep-alive',
		"link-key":key
    };
	this.accessByObj(post_option,content,successFun,errorFun,httpType);
}
HttpClient.prototype.accessByObj=function(requestObj,datas,successFun,errorFun,httpType){  
	var that=this;
	var timeoutEventId;
	var httpObj=httpType||this.http;
	var req=httpObj.request(requestObj, function (res) {
		if(res.statusCode==200){
			var responeBody=[];
			res.setEncoding('utf8');
			res.on('data', function (body) {
				responeBody.push(body);
			}).on('end',function(e){
				clearTimeout(timeoutEventId);
				if(successFun){
					var responeStr=responeBody.join('');
					try{
						// that.logInfo.info(responeStr);
						//var jsonObj = eval("(" + responeStr + ")");
						var jsonObj=JSON.parse(responeStr);
						if(jsonObj.status&&jsonObj.status=="fail"){
							that.logInfo.error("调用："+JSON.stringify(requestObj));
							that.logInfo.error("参数："+JSON.stringify(datas));
							that.logInfo.error("结果："+JSON.stringify(jsonObj));
						}
						successFun(jsonObj);
					}catch(e){
						that.logInfo.error("调用1："+JSON.stringify(requestObj));
						that.logInfo.error("参数1："+JSON.stringify(datas));
						that.logInfo.error("结果1："+responeBody);
						that.logInfo.error("url："+requestObj.href);
						that.logInfo.error(e.message);
						that.logInfo.error(responeStr);
						that.logInfo.error("-----------------------------");
						
						errorFun({"status":"fail","errorMsg":"调用接口错误"});
					}
				}
			}).on('close',function(){
				clearTimeout(timeoutEventId);
			});
		}else{
			that.logInfo.error("------------------------------------");
			that.logInfo.error("调用1："+JSON.stringify(requestObj));
			that.logInfo.error("请求参数："+JSON.stringify(datas));
			try {
			  	that.logInfo.error("返回数据"+res.writeHead());
			} catch (ex) {
			 	that.logInfo.error("头信息读取失败："+ex);
			 	errorFun({"status":"fail","errorMsg":"调用接口错误"+ex});
			}
			that.logInfo.error("错误头"+JSON.stringify(requestObj));
			that.logInfo.error("错误返回"+JSON.stringify(res.toString()));
			that.logInfo.error("接口调用失败。");
			that.logInfo.error("************************************");
			if (errorFun) {
				errorFun({"status":"fail","errorMsg":"调用接口错误"+res.statusCode});
			};
		}
	});
	if(datas){
		req.write(datas);  
	}
	req.end(); 

	req.on('error', function (e) {
		that.logInfo.error("错误内容："+JSON.stringify(requestObj)+"**********"+e.message);
		if (errorFun) {
			errorFun({"status":"fail","errorMsg":"连接超时！"})
		};
	});
	req.setTimeout(that.timeout,function(msg){
		req.abort();
	});
	timeoutEventId=setTimeout(function(){
		req.emit('timeout',{"status":"fail","errorMsg":"连接超时！"});
	},that.timeout);
    
}
HttpClient.prototype.get=function(path,datas,successFun,errorFun){
	this.access(path,datas,'GET',successFun,errorFun);
}
HttpClient.prototype.post=function(path,datas,successFun,errorFun){
	this.access(path,datas,'POST',successFun,errorFun);
}
exports.init= function (httpObj){
	return new HttpClient(httpObj);
};