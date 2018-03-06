var httpClient=require('../lib/HttpClient');
var config=require('../config/config.json');

function MainService(param){
 	this.host=config.webservice.url;//配置文件中读取
 	this.http=httpClient.init({host:this.host,timeout:config.serverInfo.timeout});
}
MainService.prototype.callServer=function(formDatas,successFun,errorFun,path,method){
	//为防止注入HTML、SSX攻击注入过滤掉提交参数中的敏感内容
	for(var o in formDatas) {
		//console.log("替换前：key: " + o + " value: "+ formDatas[o]);
		if(typeof formDatas[o] == "string"){
			formDatas[o] = formDatas[o].replace(/<[^>]+>/g,"");//去掉所有的html标记
			formDatas[o] = formDatas[o].replace(/&nbsp;/ig,'');//去掉&nbsp;
			//console.log("已执行替换：" + o + " value: "+ formDatas[o]);
		}
	}
	/*for(var o in formDatas) {
		console.log("替换后：key: " + o + " value: "+ formDatas[o]);
	}*/
	if(method && method != "" && method.toUpperCase() === "GET"){
		this.http.get(path,formDatas,function(jsonObj){
			successFun(jsonObj);
		},function(errorText){
			errorFun(errorText);
		});

	}else{
		this.http.post(path,formDatas,function(jsonObj){
			successFun(jsonObj);
		},function(errorText){
			errorFun(errorText);
		});
	}
	
}
exports.init= function (httpObj){
	//console.log(httpObj['host']+"****************************");
	return new MainService(httpObj);
};