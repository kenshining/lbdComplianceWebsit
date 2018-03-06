var redis = require("redis");
var config=require('../../config/config.json');
/**我的账户安全设置路由**/
exports.init= function(app,serviceInstance,serviceEnumerationInstance,logInfo,jsVersion,cssVersion){

	//验证图片验证码和短信验证码是否正确。
	app.post('/securitySetting/validateMsgCode',function(req,res){

	    var tel = req.body.telephone;
	    var imgCode = req.body.imgCode;
	    var msgCode = req.body.msgCode;
	    
	    //从redis里取出预存正确的比对验证码
	    var s_imgCode = req.session.validateImgCode;
		var s_smsCode = req.session.validateMsgCode;

		//验证图片验证码是否正确
		if(imgCode.toUpperCase() != s_imgCode.toUpperCase()){
			return res.json({status:false,errorFeild:'imgCode'});
		}
		//验证短信验证码是否正确
		else if(msgCode.toUpperCase() != new String(s_smsCode).toUpperCase()){
			return res.json({status:false,errorFeild:'smsCode'});
		}
		else{
			return res.json({status:true});
		}
	});


	//修改手机号码保存提交
	app.post('/securitySetting/reviseMobile',function(req,res){
		//获取传递用户登录信息
    	var userInfo = req.session.user;
	    var tel = req.body.telephone;
	    var imgCode = req.body.imgCode;
	    var msgCode = req.body.msgCode;

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
	    		userId:userInfo.id

	    	//成功回调
	    	},function(msg){
	    		if(msg.state === "SUCCESS"){
	    			//修改成功，更新用户信息
					req.session.user.telephone = tel;
					//清理修改手机号码使用到的验证信息
					req.session.validateMsgCode = null;
					req.session.validateMsgPhone = null;
					req.session.validateImgCode = null;

	    			return res.json({status:true});

	    		}else{
	    			return res.json({status:false,errorFeild:'',sObj:msg});
	    		}
	    	//失败回调
	    	},function(msg){
	    		res.json(msg);
	    	},
	    	serviceEnumerationInstance.ACCOUNT_REVISE_MOBILE);
	});


	//验证身份证号是否可用
	app.post('/securitySetting/validateIdCard',function(req,res){
	    var idCard = req.body.idCard;
        serviceInstance.callServer({idCard:idCard
        //接口成功的函数
        },function(msg){
    		res.json(msg);
    	//失败回调
    	},function(msg){
    		res.json({msg:"链接超时！"});
    	},
    	serviceEnumerationInstance.ID_CARD_VALIDATOR);
	});

	//实名认证
	app.get('/securitySetting/validateRealName',function(req,res){
		//获取传递用户登录信息
	    var userInfo = req.session.user;
	    var name = req.query.name;
	    var idCard = req.query.idCard;

        serviceInstance.callServer({
        	userId:userInfo.id,
        	name:name,
        	idCard:idCard
        //接口成功的函数
        },function(msg){
        	//实名认证成功，暂存用户身份信息到session
        	if(msg.state == "SUCCESS"){
        		req.session.user.name = name;
        		req.session.user.idCard = idCard;
        	}
    		res.json(msg);
    	//失败回调
    	},function(msg){
    		res.json({msg:"链接超时！"});
    	},
    	serviceEnumerationInstance.USET_REAL_NAME_AUTH);
	});


	//修改登录密码，比对原登录密码是否正确
	app.post('/securitySetting/volidateOldPwd',function(req,res){
		//获取用户原登录密码
		var userInfo = req.session.user
		var pwd = req.body.pwd;

		serviceInstance.callServer(
			{telephone:userInfo.telephone,password:pwd.toUpperCase()},
		function(msg){
			//验证正确
			if(msg.state == "SUCCESS"){
				req.session.reviseLoginPwdCount = null;
			//验证失败，登录密码输错5次后重新登录
			}else{
				//如果当前验证次数不存在，或第一次验证则初始化Session内计数器值
				if(!req.session.reviseLoginPwdCount || req.session.reviseLoginPwdCount == null){
					req.session.reviseLoginPwdCount = 1;
				}else{
					//当前已出错次数大于次，则累计出错次数
					req.session.reviseLoginPwdCount = req.session.reviseLoginPwdCount + 1;
				}
			}
			res.json({
				count:req.session.reviseLoginPwdCount,
				msg:msg
			});
		},function(msg){
			res.json(msg);
		},serviceEnumerationInstance.USER_VALIDATE_LOGIN);
	});

	//提交修改的登录密码
	app.post('/securitySetting/reviseLoginPwd',function(req,res){
		//获取传递用户登录信息
	    var userInfo = req.session.user;
	    var password = req.body.password;

        serviceInstance.callServer({
        	telephone:userInfo.telephone,
        	password:password
        //接口成功的函数
        },function(msg){
    		res.json(msg);
    	//失败回调
    	},function(msg){
    		res.json(msg);
    	},
    	serviceEnumerationInstance.USER_REST_PASSWORD);
	});

	//修改交易密码，比对原交易密码是否正确
	app.post('/securitySetting/volidateOldDealPwd',function(req,res){
		//获取用户信息
		var userInfo = req.session.user
		var pwd = req.body.pwd;
		
		serviceInstance.callServer(
			{userId:userInfo.id,tradingPassword:pwd},
		function(msg){
			if(msg.state == "SUCCESS"){
				res.json({
					state:"SUCCESS",
					message:msg.message
				});
			};
			if(msg.state == "FAIL" &&　msg.code == "92014"){
				//如果当前验证次数不存在，或第一次验证则初始化Session内计数器值
				if(!req.session.reviseDealPwdCount || req.session.reviseDealPwdCount == null){
					req.session.reviseDealPwdCount = 1;
				}else{
					//当前已出错次数大于次，则累计出错次数
					req.session.reviseDealPwdCount = req.session.reviseDealPwdCount + 1;
				}
				res.json({
					state:"FAIL",
					count:req.session.reviseDealPwdCount,
					message:msg.message,
					code:msg.code
				});
			};
			if(msg.state == "FAIL" && msg.code == "92013"){
				res.json({
					state:"FAIL",
					count:req.session.reviseDealPwdCount,
					message:msg.message,
					code:msg.code
				});
			};
		},function(msg){
			res.json(msg);
		},serviceEnumerationInstance.VOLIDATE_USER_OLDDEALPWD);
	});

	//修改交易密码
	app.post('/securitySetting/reviseDealPwd',function(req,res){
		//获取传递用户登录信息
	    var userInfo = req.session.user;
	    var password = req.body.pwd;

        serviceInstance.callServer({
        	userId:userInfo.id,
        	tradingPassword:password
        //接口成功的函数
        },function(msg){
    		res.json(msg);
    	//失败回调
    	},function(msg){
    		res.json(msg);
    	},
    	serviceEnumerationInstance.USER_REVISE_DEAL_PWD);
	});

	//用户头像保存
	app.post('/securitySetting/saveUserPic',function(req,res){

		//获取用户信息
		var userInfo = req.session.user;
		//获取传递参数
		var userPicBase64 = req.body.userPicBase64;

		serviceInstance.callServer({
        	userId:userInfo.id,
        	img:userPicBase64.substr(22)
        //接口成功的函数
        },function(msg){
        	console.info(JSON.stringify(msg));
        	//更新session中头像文件位置
        	req.session.user.headPortrait = msg.data.url;
    		res.json({
    			imageServer:config.imageServer.url,
    			state:0,
    			imageUrl:msg.data.url
    		});
    	//失败回调
    	},function(msg){
    		res.json({
    			imageServer:config.imageServer.url,
    			state:1,
    			imageUrl:''
    		});
    	},
    	serviceEnumerationInstance.ACCOUNT_USER_PICS);
	});
	//设置交易密码
	app.post('/securitySetting/setDealPwd',function(req,res){
		//获取传递用户登录信息
	    var userInfo = req.session.user;
	    var password = req.body.password;

        serviceInstance.callServer({
        	userId:userInfo.id,
        	tradingPassword:password
        //接口成功的函数
        },function(msg){
        	//设置成功，交易密码验证次数清除
        	if(msg.state == 'SUCCESS'){
        		req.session.reviseDealPwdCount = null;
        	}
    		res.json(msg);
    	//失败回调
    	},function(msg){
    		res.json(msg);
    	},
    	serviceEnumerationInstance.USER_SET_TRADINGPASSWORD);
	});


	//发送邮件
	app.post('/securitySetting/sendEmail',function(req,res){
		
		//获取传递用户登录信息
	    var toUser = req.body.toUser;
	    var template = req.body.template;
	    var content = req.body.content;
	    var userInfo = req.session.user;

	    var time = new Date();
	    var year = time.getFullYear();
	    var month = time.getMonth()+1;
	    var day = time.getDate();
	    var hour = time.getHours();
	    var minute = time.getMinutes(); 

	    //添加邮件发送时间
	    content = JSON.parse(content);
	    content.date = year + "年" + month + "月" + day + "日" + hour + "时" + minute + "分";

        serviceInstance.callServer({
        	toUser:toUser,
        	template:template,
        	content:JSON.stringify(content)
        //接口成功的函
        },function(msg){
        	//链接Redis暂存验证有效信息
        	//创建链接
		    var RDS_PORT = config.redisConfig.post,//端口号
		        RDS_HOST = config.redisConfig.host,//服务器IP
		        RDS_OPTS = {},            //设置项
		        client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);
		     //链接创建成功回调函数执行    
		    client.on('connect', function(results) {
		      //保存数据
		      client.hmset('validate:emailValidate_'+userInfo.id, {
		        "userId":userInfo.id,
		        "email":toUser
		      }, function(err,r){
			        //数据保存数据结果
			        //设置过期时间
			        client.expire('validate:emailValidate_'+userInfo.id,60*60*24*1);
			        //处理完成关闭链接
			        client.quit();
			       	res.json(msg);
		    	});
			});
		    
    	//失败回调
    	},function(msg){
    		res.json(msg);
    	},
    	serviceEnumerationInstance.EMAIL_SEND);
	});

	//邮箱认证结果
	app.post('/securitySetting/emailResult',function(req,res){
		//获取传递用户登录信息
	    var userInfo = req.session.user;
	    var email = req.body.email;

        serviceInstance.callServer({
        	userId:userInfo.id,
        	email:email
        //接口成功的函数
        },function(msg){
        	//邮箱认证成功，暂存用户邮箱到session
        	if(msg.state == "SUCCESS"){
        		req.session.user.email = email;
        	}
    		res.json(msg);
    	//失败回调
    	},function(msg){
    		res.json(msg);
    	},
    	serviceEnumerationInstance.USER_UPDATE_EMAIL);
	});

	//检测银行卡类类型
	app.post('/securitySetting/bindBankCardType',function(req,res){
	    var cardNo = req.body.cardNo;
        serviceInstance.callServer({cardNo:cardNo
        //接口成功的函数
        },function(msg){
    		res.json(msg);
    	//失败回调
    	},function(msg){
    		res.json({msg:"链接超时！"});
    	},
    	serviceEnumerationInstance.BANK_CARD_INFO);
	});

	//根据银行卡类型获取银行卡的相关信息
	app.post('/securitySetting/bindBankCardInfoByType',function(req,res){
	    var shortName = req.body.shortName;
	    var cardType = req.body.cardType;
	    var rechargeType = req.body.rechargeType;
        serviceInstance.callServer({
        	shortName:shortName,
        	cardType:cardType,
        	rechargeType:rechargeType
        //接口成功的函数
        },function(msg){
    		res.json(msg);
    	//失败回调
    	},function(msg){
    		res.json({msg:"链接超时！"});
    	},
    	serviceEnumerationInstance.BANKCARD_TYPE_DETAIL);
	});

	//绑定银行卡
	app.post('/securitySetting/bindcard',function(req,res){
	    var bankNo = req.body.bankNo;
	    var bankBranch = req.body.bankBranch;
	    var userId	= req.session.user.id;
	    var bankCardId = req.body.bankCardId;
        serviceInstance.callServer({
        	bankNo:bankNo,
        	bankBranch:bankBranch,
        	userId:userId,
        	'bankCard.id':bankCardId
        //接口成功的函数
        },function(msg){
    		res.json(msg);
    	//失败回调
    	},function(msg){
    		res.json({msg:"链接超时！"});
    	},
    	serviceEnumerationInstance.BINDCARD_BINDCARD);
	});
};