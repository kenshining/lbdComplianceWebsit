/**
*	前端JS验证支持
*	checkMobileNo 	检测手机是否正确
*	checkIdCard 	检查身份证号是否正确
*	checkQuote	检查输入的字符是否具有特殊字符
*	checkURL	检查输入的URL地址是否正确
*	checkPwd	密码验证 字母加数字或符号的组合密码，不能单独使用数字、字母或字符
*	isNull		检查输入字符串是否为空或者全部都是空格
*	isInteger	检查输入对象的值是否符合整数格式
*	isNumber	检查输入字符串是否符合正整数格式
*	isDecimal	检查输入字符串是否是带小数的数字格式,可以是负数
*	isEmail		检查输入对象的值是否符合E-Mail格式
*	isName 		检测姓名是否为姓名为2~6个汉字
*	isCityName 	检测城市名称是否为姓名为2~10个汉字
**/
function CommonValidationUtils(options){
	this.options = options;
}
CommonValidationUtils.prototype = {
	/*
	用途：检查输入手机号码是否正确
	输入：
	s：字符串
	返回：
	如果通过验证返回true,否则返回false
	*/
	checkMobileNo : function (phone){ 
		if(!(/^1[3|4|5|7|8]\d{9}$/.test(phone))){
			return false; 
		} else{
			return true;
		}
	},
	/**
	* 检查输入的身份证号是否正确
	* 输入:str  字符串
	*  返回:true 或 flase; true表示格式正确
	*/
	checkIdCard : function (str) {
	    //15位数身份证正则表达式
	    var arg1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
	    //18位数身份证正则表达式
	    var arg2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/;
	    if (str.match(arg1) === null && str.match(arg2) === null) {
	        return false;
	    }
	    else {
	        return true;
	    }
	},
	/**
	* 检查输入的字符是否具有特殊字符
	* 输入:str  字符串
	* 返回:true 或 flase; true表示包含特殊字符
	* 主要用于注册信息的时候验证
	*/
	checkQuote : function(str) {
	    var items = new Array("~", "`", "!", "@", "#", "$", "%", "^", "&", "*", "{", "}", "[", "]", "(", ")");
	    items.push(":", ";", "'", "|", "\\", "<", ">", "?", "/", "<<", ">>", "||", "//");
	    items.push("admin", "administrators", "administrator", "管理员", "系统管理员");
	    items.push("select", "delete", "update", "insert", "create", "drop", "alter", "trancate");
	    str = str.toLowerCase();
	    for (var i = 0; i < items.length; i++) {
	        if (str.indexOf(items[i]) >= 0) {
	            return true;
	        }
	    }
	    return false;
	},
	/**
	* 检查输入的URL地址是否正确
	* 输入:str  字符串
	*  返回:true 或 flase; true表示格式正确
	*/
	checkURL : function (str) {
	    if (str.match(/(http[s]?|ftp):\/\/[^\/\.]+?\..+\w$/i) === null) {
	        return false;
	    }
	    else {
	        return true;
	    }
	},
	/**
	* 检查输入的密码是否为两种以上字符组成。
	* 密码验证 字母加数字或符号的组合密码，不能单独使用数字、字母或字符
	**/
	checkPwd : function(password){
	    var num = 0;  
	    var number = 0 ;  
	    var letter = 0 ;  
	    var bigLetter = 0 ;  
	    var chars = 0 ;  
	    if(password.search(/\s+/g) != -1){
	    	return false;
	    }
	    if (password.search(/[0-9]/) != -1) {  
	        num += 1;  
	        number =1;  
	    }  
	    if (password.search(/[A-Z]/) != -1) {  
	        num += 1;  
	        bigLetter = 1 ;  
	    }  
	    if (password.search(/[a-z]/) != -1) {  
	        num += 1;  
	        letter = 1 ;  
	    }  
	    if (password.search(/[^A-Za-z0-9]/) != -1) {  
	        num += 1;  
	        chars = 1 ;  
	    }  
	    if (num >= 2 && (password.length >= 6 && password.length <= 20)) {  
	        return true;
	    }else if(password.length < 6 || password.length > 20){
	    	//密码由6-20个字符组成
	        return false;
	    }else if(num == 1){  
	        if(number==1){  
	           //不能全为数字
	           return false;
	        }  
	        if(letter==1){
	        	//不能全为字母
	           return false;
	        }  
	        if(bigLetter==1){
	        	//不能全为字母
	           return false;
	        }  
	        if(chars==1){
	        	//不能全为字符
	           return false;
	        }  
	        return true;
	    }
	},  
	/*
	用途：检查输入字符串是否为空或者全部都是空格
	输入：str
	返回：
	如果全是空返回true,否则返回false
	*/
	isNull : function (str){
		if ( str === "" ) return true;
		var regu = "^[ ]+$";
		var re = new RegExp(regu);
		return re.test(str);
	},
	/*
	用途：检查输入对象的值是否符合整数格式
	输入：str 输入的字符串
	返回：如果通过验证返回true,否则返回false
	*/
	isInteger : function (str){
		var regu = /^[-]{0,1}[0-9]{1,}$/;
		return regu.test(str);
	},
	/*
	用途：检查输入字符串是否符合正整数格式
	输入：
	s：字符串
	返回：
	如果通过验证返回true,否则返回false
	*/
	isNumber : function (s){
		var regu = "^[0-9]+$";
		var re = new RegExp(regu);
		if (s.search(re) != -1) {
			return true;
		} else {
			return false;
		}
	},
	/*
	用途：检查输入字符串是否是带小数的数字格式,可以是负数
	输入：
	s：字符串
	返回：
	如果通过验证返回true,否则返回false
	*/
	isDecimal : function(str){
		if(isInteger(str)) return true;
			var re = /^[-]{0,1}(\d+)[\.]+(\d+)$/;
			if (re.test(str)) {
				if(RegExp.$1===0&&RegExp.$2===0) return false;
				return true;
				} else {
				return false;
		}
	},
	/*
	用途：检查输入对象的值是否符合E-Mail格式
	输入：str 输入的字符串
	返回：如果通过验证返回true,否则返回false
	*/
	isEmail : function (str){
		var myReg = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;
		if(myReg.test(str))return true;
		return false;
	},
	/*
	用途：检测输入的字符串是否符合2-6个的汉字
	输入：str
	返回：如果通过验证返回true,否则返回false
	*/
	isName: function(str){
		var reg = /^[\u4E00-\u9FA5]{2,6}$/g;
		if(reg.test(str)) return true;
		return false;
	},
	/*
	用途：检测输入的字符串是否符合2-10个的汉字
	输入：str
	返回：如果通过验证返回true,否则返回false
	*/
	isCityName: function(str){
		var reg = /^[\u4E00-\u9FA5]{2,10}$/g;
		if(reg.test(str)) return true;
		return false;
	}
	
};