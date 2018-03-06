var tools= require('../lib/tools');
//keywords config
var keywords=require('../config/keywords.json');
/**
* 用户账户操作路由配置
**/
exports.init= function(app,serviceInstance,serviceEnumerationInstance,logInfo){

	/**校验用户Session是否仍然在有效期范围内**/
	app.get('/user/validateUserActive',function(req, res){
	    if(!req.session || !req.session.user){
	      res.json({status:'fail'});
	    }else{
	      res.json({status:'ok'});
	    }
	});

	/**获取用户账户余额**/
	app.post('/user/banlance',function(req, res){
	   //用户登录后才能获取用户余额若用户未登录返回余额 0
	   var user = req.session.user;
	   if(user){
		   	serviceInstance.callServer({userId:user.id},function(msg){
				//成功回调方法
				res.json({banlance:msg.data.banlance,msg:msg});
			},function(msg){
				//失败回调方法
				res.json({banlance:0,msg:msg});
			},
			serviceEnumerationInstance.INVESTMENT_USER_BALANCE,"POST");
	   }else{
	   		res.json({banlance:0});
	   }

	});

	/**跳转用户登录页**/
	app.get('/user/login', function(req, res){
		//获取跳转参数
	    var history = req.query.history;
	    req.session.historyPath = history;
	    //避免用户刷新时跳过验证码输入项
	    var count = 0;
	    if(req.session.validateCount){
	    	count = req.session.validateCount;
	    	if(count < 3){
				req.session.validateImgCode = null;
	    	}	
	    }else{
	    	req.session.validateImgCode = null;
	    }
	    res.render('user/login', {
			title: keywords.websiteTitle,
			keywords:keywords.keywords,
			description:keywords.description,
			userInfo:null,
			count:count
		});
	});

	/**跳转用户注册**/
	app.get('/user/regist', function(req, res){
		//获取跳转参数
	    var history = req.query.history;
	    req.session.historyPath = history;
	    res.render('user/regist', {
			title: keywords.websiteTitle,
			keywords:keywords.keywords,
			description:keywords.description,
			userInfo:null
		});
	});

	/**跳转乐百贷用户协议页**/
	app.get('/agreement/website_service_protocal', function(req, res){
		//获取跳转参数
	    var history = req.query.history;
	    req.session.historyPath = history;
	    res.render('agreement/website_service_protocal', {
			title: keywords.websiteTitle,
			keywords:keywords.keywords,
			description:keywords.description
		});
	});

	/**跳转忘记密码页**/
	app.get('/user/forget_password', function(req, res){
		//获取跳转参数
	    var history = req.query.history;
	    req.session.historyPath = history;
	    res.render('user/forget_password', {
			title: keywords.websiteTitle,
			keywords:keywords.keywords,
			description:keywords.description,
			userInfo:null
		});
	});

	//获取图片验证码
	app.get('/user/validateImgCode',function(req, res){
		//调用后端服务生成图片验证码
		serviceInstance.callServer({length:4}
		,function(msg){
			//成功回调方法
			if(msg.state === "SUCCESS"){
				//暂存图片验证码至Session
				req.session.validateImgCode = msg.data.code.toUpperCase().toString();
				res.json({
					status:true,
					validateCodeImg:msg.data.img
				});
			}
		},function(msg){
			//失败回调方法
			res.json(msg);
		},
		serviceEnumerationInstance.COMMON_VALIDATE_PICTRURE);
	});

	//获取短信验证码
	app.post('/user/validateMsgCode',function(req, res){

		var tel = req.body.telephone;
		var imgCode = req.body.imgValCode;
		var ip = tools.tools.getClientIp(req);
		//验证图片验证码是否正确
		var s_imgCode = req.session.validateImgCode;

		if(imgCode.toUpperCase() != s_imgCode.toUpperCase()){
			return res.json({status:false,errorFeild:'imgCode'});
		}
		//获取客户端ip
		if(req.body.ip && req.body.ip == 0){
			ip = "";
		};
		
		serviceInstance.callServer({telephone:tel,ip:ip}
		,function(msg){
			//接口数据返回成功的回调
			if(msg.state === "SUCCESS"){
				//暂存短信验证码至Session
				req.session.validateMsgCode = msg.data;
				req.session.validateMsgPhone = tel;
				res.json({
					status:true,
					errorCode:msg.code,
					errorMsg:msg.message
				});
			}else{
				res.json({
					status:false,
					errorCode:msg.code,
					errorMsg:msg.message
				});
			}
		},function(msg){
			//接口的失败回调
			res.json(msg);
		},
		serviceEnumerationInstance.COMMON_VALIDATE_SMS);
	});

	//检测图形验证码是否正确
	app.post('/user/checkValidateImgCode',function(req, res){
	    //验证图片验证码是否正确
	    var imgCode = req.session.validateImgCode;
	    var inputImgCode = req.body.validateImgCode;

    	if(imgCode.toUpperCase() != inputImgCode.toUpperCase()){
    	 	res.json({status:false,msg:'imgCode'});
    	}else{
    		res.json({status:true,msg:'imgCode'});
    	}
	});

	//检测短信验证码是否正确
	app.post('/user/checkValidateMsgCode',function(req, res){
	    //验证图片验证码是否正确
	    var MsgCode = req.session.validateMsgCode;
	    var inputMsgCode = req.body.validateMsgCode;
	    var telephone = req.body.telephone;

	    var sendedPhone = req.session.validateMsgPhone;
	    if(sendedPhone != telephone){
	    	//输入的手机号与发送短信手机不符
	    	return res.json({status:false,msg:'mobile',errorCode:"355"});
	    }
    	if(MsgCode != inputMsgCode){
    	 	res.json({status:false,msg:'msgCode'});
    	}else{
    		res.json({status:true,msg:'msgCode'});
    	}
	});

	//退出登录
	app.get('/user/logout',function(req, res){
		var history = req.query.history;
	    req.session.historyPath = history;
	    //清空所有登录项目
	    req.session.validateMsgCode = null;
		req.session.validateMsgPhone = null;
		req.session.validateImgCode = null;
		req.session.validateCount = null;
		req.session.user = null;
		res.json({status:true,returnURL:history});
	});


	//登录页面的用户信息验证
	app.post('/user/validateUserLogin',function(req, res){

	    var history = req.session.historyPath;
	    var tel = req.body.telephone;
	    var inputImgCode = req.body.validateImgCode;
	    var pwd = req.body.password;

	    //验证状态(若验证用户登录成功则修改状态为true)
	    var validateState =  false;
	    //检测用户登录次数累计
	    //若大于3次则需要显示验证码
	    var validateCount = 0;

	    //如果当前验证次数不存在，或第一次验证则初始化Session内计数器值
	    if(!req.session.validateCount || req.session.validateCount < 1){
	    	validateCount = 1;
	    	req.session.validateCount = validateCount;
	    }else{
	    	//当前已出错次数大于次，则累计出错次数
	    	validateCount = req.session.validateCount + 1;
	    }

	    //如果当前存在验证码。则需要验证验证码
	    if(req.session.validateImgCode && req.session.validateImgCode != null){
	    	var imgCode = req.session.validateImgCode;
	    	if(imgCode != inputImgCode.toUpperCase()){
	    	 	//验证失败，返回验证码错误
	    	 	return res.json({
	    	 		status:false,
	    	 		statusCode : "0",
	    	 		msg:"imgCode",
	    	 		count:validateCount
	    	 	});
	    	 }else{
	    	 	serviceInstance.callServer({telephone:tel,password:pwd.toUpperCase()},
		        //成功回调
		        function(msg){
		        	//用户名或密码错误
			        if(msg.state == "FAIL" && msg.code == "92001"){
			          	req.session.validateCount = validateCount;
			          	res.json({
			    	 		status:false,
			    	 		statusCode : "1",
			    	 		msg:"userName",
			    	 		count:validateCount
			    	 	});
			    	//用户名被禁止
		          	}else if(msg.state == "FAIL" && msg.code == "92002"){
	          	      	req.session.validateCount = validateCount;
	          	      	res.json({
	          		 		status:false,
	          		 		statusCode : "2",
	          		 		msg:"userName",
	          		 		count:validateCount
	          		 	});
		         	 }else{
			          	//登录成功存储用户登录状态
			          	req.session.user = msg.data;
			          	//做清理动作
			          	req.session.validateMsgCode = null;
						req.session.validateMsgPhone = null;
						req.session.validateImgCode = null;
						req.session.validateCount = null;
						req.session.reviseLoginPwdCount = null;
			          	res.json({
			    	 		status:true,
			    	 		historyPath:history
			    	 	});
		          	}
			          //失败回调
			        },function(msg){

			        },
			        serviceEnumerationInstance.USER_VALIDATE_LOGIN);
	    	 }
	    }else{
			serviceInstance.callServer({telephone:tel,password:pwd.toUpperCase()},
		        //成功回调
		        function(msg){
		        	//用户名或密码错误
		          if(msg.state == "FAIL" && msg.code == "92001"){
		          	req.session.validateCount = validateCount;
		          	res.json({
		    	 		status:false,
		    	 		statusCode : "1",
		    	 		msg:"userName",
		    	 		count:validateCount
		    	 	});
		    	 	//用户禁止
		          }else if(msg.state == "FAIL" && msg.code == "92002"){
		          	req.session.validateCount = validateCount;
		          	res.json({
		    	 		status:false,
		    	 		statusCode : "2",
		    	 		msg:"userName",
		    	 		count:validateCount
		    	 	});
		          }else{
		          	//登录成功存储用户登录状态
		          	req.session.user = msg.data;
		          	//做清理动作
		          	req.session.validateMsgCode = null;
					req.session.validateMsgPhone = null;
					req.session.validateImgCode = null;
					req.session.validateCount = null;
					req.session.reviseLoginPwdCount = null;
		          	res.json({
		    	 		status:true,
			    	 	historyPath:history
		    	 	});
		          }
		          //失败回调
		        },function(msg){

		        },
		        serviceEnumerationInstance.USER_VALIDATE_LOGIN);
	    }
	});

	//验证用户是否已经注册。
	app.post('/user/validateUserRegist',function(req, res){
	   //验证手机号码是否已注册
	    var inputTel = req.body.validateTel;
	    if(inputTel){
	        serviceInstance.callServer({telephone:inputTel},
	        //成功回调
	        function(msg){
	           res.json({status:msg.data,errorCode:'mobile',msg:msg});
	         //失败回调
	        },function(msg){
	        	res.json(msg);
	        },
	        serviceEnumerationInstance.USER_VALIDATE_USER_EXIST);
	    };
	});

	// 获取用户输入邀请码是否有效
	app.post('/user/validateUserInviteCode',function(req, res){
	   //验证手机号码是否已注册
	    var inviteCode = req.body.inviteCode;
	    
        serviceInstance.callServer({invitedCode:inviteCode},
        //成功回调
        function(msg){
        	//暂存用户邀请码
           	res.json({status:msg.data,errorCode:'inviteCode',msg:msg});
          //失败回调
        },function(msg){

        },
        serviceEnumerationInstance.USER_VALIDATE_INVATECODE_EXIST);
	    
	});
	
	//注册提交
	app.post('/user/submitRegist',function(req,res){

		var history = req.query.history;
	    req.session.historyPath = history;

	    var tel = req.body.telephone;
	    var pwd = req.body.password;
	    var imgCode = req.body.imgCode;
	    var msgCode = req.body.msgCode;
	    var invitedCode = req.body.inviteCode;

	    //验证图片验证码和短信验证码是否正确。
	    //从redis里取出预存正确的比对验证码
	    var s_imgCode = req.session.validateImgCode;
		var s_smsCode = req.session.validateMsgCode;

		//验证图片验证码是否正确
		if(imgCode.toUpperCase() != s_imgCode.toUpperCase()){
			return res.json({status:false,errorFeild:'imgCode'});
		}
		//验证短信验证码是否正确
		if(msgCode.toUpperCase() != new String(s_smsCode).toUpperCase()){
			return res.json({status:false,errorFeild:'smsCode'});
		}
		//验证是否存在该手机号
		//验证发送短信的手机号是否为短信接收的手机号
		var sendedPhone = req.session.validateMsgPhone;
		if(sendedPhone != tel){
			return res.json({status:false,errorFeild:'mobile',errorCode:"355"});
		}

	    serviceInstance.callServer(
	    	{
	    		telephone:tel,
	    		password:pwd,
	    		plantFrom:1,
	    		invitedCode:invitedCode

	    	//成功回调
	    	},function(msg){
	    		if(msg.state === "SUCCESS"){
	    			//注册成功添加登录信息
	    			
					req.session.user = msg.data;
					//清理注册使用到的验证信息
					req.session.validateMsgCode = null;
					req.session.validateMsgPhone = null;
					req.session.validateImgCode = null;
					req.session.validateCount = null;
	    			return res.json({status:true});
	    		}else{
	    			return res.json({status:false,errorFeild:'',sObj:msg});
	    		}
	    	//失败回调
	    	},function(msg){
	    		res.json({status:false});
	    	},
	    	serviceEnumerationInstance.USER_REGIST_SAVE);
	});

	//修改密码校验手机号、图片验证码、短信验证码是否正确。
	app.post('/user/validateForgetPwd',function(req, res){
		//校验输入项是否正确
		var s_imgCode = req.session.validateImgCode;
		var s_smsCode = req.session.validateMsgCode;
		
		//因为此处修改密码是分布提交完成，先提交验证，后修改密码此处验证通过后生成并返回Token
		//若验证失败则不会生成token
		if(req.session.validateStepToken){
			req.session.validateStepToken = null;
		}
		//验证图片验证码是否正确
		var q_imgCode = req.body.imgCode;
		if(q_imgCode.toUpperCase() != s_imgCode.toUpperCase()){
			return res.json({status:false,errorFeild:'imgCode'});
		}
		//验证短信验证码是否正确
		var q_smsCode = req.body.smsCode;
		if(q_smsCode.toUpperCase() != new String(s_smsCode).toUpperCase()){
			return res.json({status:false,errorFeild:'smsCode'});
		}
		//验证是否存在该手机号
		var q_mobile = req.body.mobile;
		//验证发送短信的手机号是否为短信接收的手机号
		var sendedPhone = req.session.validateMsgPhone;
		if(sendedPhone != q_mobile){
			return res.json({status:false,errorFeild:'mobile',errorCode:"355"});
		}
		serviceInstance.callServer({telephone:q_mobile}
		,function(msg){
			//成功回调方法
			if(msg.state === "SUCCESS"){
				if(msg.data){
					//生成第二步提交Token
					var token = tools.tools.uuid(8, 16);
					req.session.validateStepToken = token;
					//清除第一步产生的确认信息
					req.session.validateMsgCode = null;
					req.session.validateMsgPhone = null;
					req.session.validateImgCode = null;
					req.session.validateCount = null;
					return res.json({status:true,validateStepToken:token});
				}else{
					//手机号不存在
					return res.json({status:false,errorFeild:'mobile'});
				}
			}
		},function(msg){
			//失败回调方法

		},
		serviceEnumerationInstance.USER_VALIDATE_USER_EXIST);

	});

	//修改密码提交
	app.post('/user/resetPwd',function(req, res){
		//校验输入项是否正确
		var token = req.session.validateStepToken;
		var submitToken = req.body.token;
		//验证token是否一致
		if(token != submitToken){
			return res.json({status:false,msg:'提交的Token无效。'});
		}
		//修改动作
		var password = req.body.password;
		var telephone = req.body.telephone;
		
		serviceInstance.callServer({telephone:telephone,password:password}
		,function(msg){
			//成功回调方法
			if(msg.state === "SUCCESS"){
				//操作成功清除Token
				req.session.validateStepToken = "";
				return res.json({status:true});
			}else{
				return res.json({status:false,msg:msg.message});
			}
			
		},function(msg){
			//失败回调方法
		},
		serviceEnumerationInstance.USER_MODIFY_PWD);

	});
};