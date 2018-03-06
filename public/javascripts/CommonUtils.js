/*
* 	对基础方法的封装。
*	formatMoney	格式化金额（如无设置则按照三位分割逗号，小数点后两位返回）
*	formatTel	输入手机号码时以 XXX XXXX XXXX 的格式显示（3-4-4）
*	formatBankCard 输入银行卡号时以 XXXX XXXX XXXX XXXX 的格式显示
*	shaPassText	散列加密算法，密码加密算法。
*	floatAdd 精准计算加
*	floatSub 精准计算减
*	floatMul 精准计算乘
*	floatDiv 精准计算除
*	getUrlParams   通过参数名获取地址栏中对应的参数值
*	formatSeconds  将秒数换成时分秒格式
*/
function CommonUtils(options){
	this.options = options;
}
CommonUtils.prototype = {
  	/*
	* 	用途：格式化金额（如无设置则按照三位分割逗号，小数点后两位返回）
	*	number 被格式化数据
	*	places 小数点后保留位数
	*/
	formatMoney : function(number, places, symbol, thousand, decimal) {
	    places = !isNaN(places = Math.abs(places)) ? places : 2;
	    symbol = symbol !== undefined ? symbol : "";
	    thousand = thousand || ",";
	    decimal = decimal || ".";
	    var negative = number < 0 ? "-" : "", i = parseInt(number = Math.abs(number || 0).toFixed(places), 10) + "";
	    var j = (j = i.length) > 3 ? j % 3 : 0;
	    var result =	symbol	+ negative	+ (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
		return result;
	},
	/*
	*	用途：输入手机号码时以 XXX XXXX XXXX 的格式显示（3-4-4）
	*	tel 输入的手机号码
	*/
	formatTel: function(tel) {
		var addSpace = function (str,len){
			var reg = new RegExp('(\\d{' + (len + 1) + '})','g');
			return str.replace(reg,function(a,b){
				return b.substr(0,len) + ' ' + b.charAt(len);
			});
		};
		if(tel.length < 4){
			return addSpace(tel,2);
		}else{
			return addSpace(tel,3);
		}
	},
	/*
	*	用途：输入银行卡号时以 XXXX XXXX XXXX XXXX 的格式显示
	*	card 输入的银行卡号
	*/
	formatBankCard: function(val) {
		if(/\S{5}/.test(val)){
			return val.replace(/\s/g,'').replace(/(.{4})/g, "$1 ");
		}else{
			return val;
		}
	},
	/**
	* SHA 散列加密算法
	* 密码保存散列算法
	* SHA-1, SHA-224, SHA3-224, SHA-256, SHA3-256, SHA-384, SHA3-384, SHA-512, SHA3-512, SHAKE128, or SHAKE256.
	* HEX, TEXT, B64, BYTES, or ARRAYBUFFER.
	**/
	shaPassText:function(pwd){
		//var hashObj = new jsSHA("SHA3-256", "TEXT");
		//hashObj.update(pwd);
		//return hashObj.getHash("HEX");
		return hex_md5(pwd);
	},

	//加    
	floatAdd: function (arg1,arg2){    
	     var r1,r2,m;    
	     try{r1=arg1.toString().split(".")[1].length;}catch(e){r1=0;}
	     try{r2=arg2.toString().split(".")[1].length;}catch(e){r2=0;}
	     m=Math.pow(10,Math.max(r1,r2));
	     var _arg1 = this.floatMul(arg1,m);
	     var _arg2 = this.floatMul(arg2,m);
	     return this.floatDiv((_arg1+_arg2),m);    
	} ,  
	      
	//减    
	floatSub : function (arg1,arg2){    
	    var r1,r2,m,n;    
	    try{r1=arg1.toString().split(".")[1].length;}catch(e){r1=0;}
	    try{r2=arg2.toString().split(".")[1].length;}catch(e){r2=0;}
	    m=Math.pow(10,Math.max(r1,r2));
	    //动态控制精度长度    
	    n=(r1>=r2)?r1:r2;  
	    var _arg1 = this.floatMul(arg1,m);
	    var _arg2 = this.floatMul(arg2,m);
	    return ((_arg1-_arg2)/m).toFixed(n);
	} ,   
	       
	//乘    
	floatMul : function (arg1,arg2)   {     
	    var m=0,s1=arg1.toString(),s2=arg2.toString();     
	    try{m+=s1.split(".")[1].length;}catch(e){}
	    try{m+=s2.split(".")[1].length;}catch(e){}  
	    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);     
	} ,    
	      
	      
	//除   
	floatDiv: function (arg1,arg2){     
	      var t1=0,t2=0,r1,r2;     
	      try{t1=arg1.toString().split(".")[1].length;}catch(e){}
	      try{t2=arg2.toString().split(".")[1].length;}catch(e){}  
	        
	      r1=Number(arg1.toString().replace(".",""));  
	   
	      r2=Number(arg2.toString().replace(".",""));     
	      return (r1/r2)*Math.pow(10,t2-t1);     
	} ,

	/*	通过参数名获取地址栏中对应的参数值
		* target 参数名称
		* 返回值 string
	*/
	getUrlParams:function(target){
		//构造一个含有目标参数的正则表达式;
		var reg=new RegExp("(^|&)"+ target +"=([^&]*)(&|$)");
		var result=window.location.search.substr(1).match(reg);
		if(result!=null){
			return result[2];
		}else{
			return null;
		}
	},
	/**
	*	将秒数换成时分秒格式
	*	value秒数	
	*   返回值：对象，time为时间字符串X时XX分XX秒；timeH为小时数；timeM为分钟数；timeS为秒数；
	*/
	formatSeconds:function(value){
		var theTime = parseInt(value);// 秒
	    var theTime1 = 0;// 分
	    var theTime2 = 0;// 小时
	    var result = {};
	    if(theTime > 60) {
	        theTime1 = parseInt(theTime/60);
	        theTime = parseInt(theTime%60);
	            if(theTime1 > 60) {
	            theTime2 = parseInt(theTime1/60);
	            theTime1 = parseInt(theTime1%60);
	            }
	    }
        result.time = ""+parseInt(theTime)+"秒";
        if(theTime1 > 0) {
        result.time = ""+parseInt(theTime1)+"分"+result.time;
        }
        if(theTime2 > 0) {
        result.time = ""+parseInt(theTime2)+"小时"+result.time;
        }
        result.timeH = theTime2;
        result.timeM = theTime1;
        result.timeS = theTime;
	    return result;
	}
};

