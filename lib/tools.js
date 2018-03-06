var config=require('../config/config.json');
var crypto=require('crypto');
var tools={
		mathRand:function(max)
		{
			var Num=[];
			var max=max||6;
			var charObj=["1","2","3","4","5","6","7","8","9","0","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
			for(var i=0;i<max;i++)
			{
				var index=Math.floor(Math.random()*charObj.length);
				Num.push(charObj[index]);
			}
			console.log(Num);
			return Num.join('');
		},
 	md5:function(v){
 		//hex_md5(v).toUpperCase();
 	},
 	fail:function(msg){
 		return {"status":"fail","errorMsg":msg};
 	},
 	ok:function(msg){
 		return {"status":"ok","successMsg":msg};
 	},
 	groupUrl:function(req,path){
 		/*var host=req.rawHeaders[1];
 		console.log("*********"+host);*/
 		var fullPath=config.host+path;
      console.log("******"+fullPath);
      return  fullPath//当绑定成功后跳转的页面
 	},
 	cloneObj:function(obj){
 		var that=this;
 		var o;  
 		    switch(typeof obj){  
 		    case 'undefined': break;  
 		    case 'string'   : o = obj + '';break;  
 		    case 'number'   : o = obj - 0;break;  
 		    case 'boolean'  : o = obj;break;  
 		    case 'object'   :  
 		        if(obj === null){  
 		            o = null;  
 		        }else{  
 		            if(obj instanceof Array){  
 		                o = [];  
 		                for(var i = 0, len = obj.length; i < len; i++){  
 		                    o.push(that.cloneObj(obj[i]));  
 		                }  
 		            }else{  
 		                o = {};  
 		                for(var k in obj){  
 		                    o[k] = that.cloneObj(obj[k]);  
 		                }  
 		            }  
 		        }  
 		        break;  
 		    default:          
 		        o = obj;break;  
 		    }  
 		    return o;     
 	},
 	shareGroup:function(shareData,req,identityCode){
 	  var that=this;
   	  var inviteCode="";
   	  if(req.session&&req.session.user&&req.session.user.identityCode){
   	  	   inviteCode=req.session.user.identityCode;
   	  }else if(identityCode){
            inviteCode=identityCode;
        }
   	  var newObj=that.cloneObj(shareData);
   	     for(var k in newObj){
   	     	(function(k){
   	     		var url=newObj[k].url;
   	     		newObj[k].url=newObj[k].url+="?inviteCode="+inviteCode;
   	     	})(k)
   	     }
      return JSON.stringify(newObj);
 	},
 	dataFormat : function(date,fmt) {
 		var o = {
 			"M+" : date.getMonth() + 1, // 月份
 			"d+" : date.getDate(), // 日
 			"h+" : date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 小时
 			"H+" : date.getHours(), // 小时
 			"m+" : date.getMinutes(), // 分
 			"s+" : date.getSeconds(), // 秒
 			"q+" : Math.floor((date.getMonth() + 3) / 3), // 季度
 			"S" : date.getMilliseconds()
 		// 毫秒
 		};
 		var week = {
 			"0" : "/u65e5",
 			"1" : "/u4e00",
 			"2" : "/u4e8c",
 			"3" : "/u4e09",
 			"4" : "/u56db",
 			"5" : "/u4e94",
 			"6" : "/u516d"
 		};
 		if (/(y+)/.test(fmt)) {
 			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "")
 					.substr(4 - RegExp.$1.length));
 		}
 		if (/(E+)/.test(fmt)) {
 			fmt = fmt
 					.replace(
 							RegExp.$1,
 							((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f"
 									: "/u5468")
 									: "")
 									+ week[this.getDay() + ""]);
 		}
 		for ( var k in o) {
 			if (new RegExp("(" + k + ")").test(fmt)) {
 				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
 						: (("00" + o[k]).substr(("" + o[k]).length)));
 			}
 		}
 		return fmt;
 	},
   getClientIp:function (req) {
    var ipAddress;
    var forwardedIpsStr = req.header('x-forwarded-for'); 
    if (forwardedIpsStr) {
        var forwardedIps = forwardedIpsStr.split(',');
        ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
   },
   sha1:function(str) {
      var md5sum = crypto.createHash('sha1');
      md5sum.update(str);
      str = md5sum.digest('hex');
      return str;
   },
   platAdpte:function(platType,req){
      // 1','PC端','CLIENT_FROM'     
      // '2','安卓','CLIENT_FROM'     
      // '3','微信','CLIENT_FROM'     
      // '4','苹果手机','CLIENT_FROM'
      // '5','wap','CLIENT_FROM'
      var plat=plat;
      if(platType){
         if(platType==="android"){
            return "2";
         }
         if(platType==="ios"){
            return "4"
         }
      }else{
         var userAgent = req.headers["user-agent"];
         console.info(userAgent);
         if ((userAgent.match(/(iPhone|iPod|Android|ios|SymbianOS)/i))) {
            if(userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger'){
               return "3"
            }else{
               return "5"
            }
          }else{
            return "1"//pc
          }
      }
   },
   promotion : function(req,source,code){
      //推广方法设置

      //推广编号
      req.session.promotion_code = code;
      //推广来源
      req.session.promotion_source = source;
   },
   formatMoney : function(number, places, symbol, thousand, decimal) {
      places = !isNaN(places = Math.abs(places)) ? places : 2;
      symbol = symbol !== undefined ? symbol : "";
      thousand = thousand || ",";
      decimal = decimal || ".";
      var negative = number < 0 ? "-" : "", i = parseInt(number = Math.abs(
            +number || 0).toFixed(places), 10)
            + "", j = (j = i.length) > 3 ? j % 3 : 0;
      return symbol
            + negative
            + (j ? i.substr(0, j) + thousand : "")
            + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand)
            + (places ? decimal
                  + Math.abs(number - i).toFixed(places).slice(2) : "");
   },
   //打印对象内容
   obj2string : function(o){ 
      var r=[];
      if(typeof o=="string"){ 
         return "\""+o.replace(/([\'\"\\])/g,"\\$1").replace(/(\n)/g,"\\n").replace(/(\r)/g,"\\r").replace(/(\t)/g,"\\t")+"\""; 
      }
      if(typeof o=="object"){
         if(!o.sort){ 
            for(var i in o){ 
               r.push(i+":"+obj2string(o[i])); 
            } 
         if(!!document.all&&!/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)){ 
            r.push("toString:"+o.toString.toString()); 
         } 
      r="{"+r.join()+"}"; 
     }else{
         for(var i=0;i<o.length;i++){ 
            r.push(obj2string(o[i])) 
         } 
         r="["+r.join()+"]"; 
     }
     return r; 
    } 
    return o.toString(); 
   },
  uuid : function (len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join('');
  }

}
exports.tools=tools;
//  function (){
// 	//console.log(httpObj['host']+"****************************");
// 	return tools;
// };