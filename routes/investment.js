var tools= require('../lib/tools');
//keywords config
var keywords=require('../config/keywords.json');
var config=require('../config/config.json');
var async = require('async');  
/**
* 投资与投资确认显示
**/
exports.init= function(app,serviceInstance,serviceEnumerationInstance,logInfo){
	
    /**跳转投资列表页面**/
	app.get('/investment/investmentList', function(req, res){
		//获取跳转参数
	    var history = req.query.history;
	    req.session.historyPath = history;

	    var userInfo = req.session.user; 
	    // console.log(111);
	    res.render('investment/investmentList', {
			title: keywords.pages.investment_title,
			keywords:keywords.pages.investment_title,
			description:keywords.description,
			userInfo:userInfo
		});
	});

	/**跳转投资测评页面**/
	app.get('/investment/investorRiskAssessmentTest', function(req, res){
		//获取跳转参数
	    var history = req.query.history;
	    req.session.historyPath = history; 
	    var userInfo = req.session.user;  
	    res.render('investment/investorRiskAssessmentTest', {
			title: keywords.pages.investment_title,
			keywords:keywords.pages.investment_title,
			description:keywords.description,
			userInfo:userInfo,
			history:history
		});
	});
	/**提交投资测评**/
	app.get('/investment/investorRiskTestSave', function(req, res){
		var userInfo = req.session.user; 
	 	var userId=userInfo.id; 
	 	//15——25、25——45、45——65
	 	var arr=req.query.arr; 
	 	var score=0;
	 	for(var m=0;m<arr.length;m++){
	 		score+=parseInt(arr[m]);
	 	} 
	 	var level=1;
	 	if(score>=15&&score<25){
	 		level=1;
	 	}else if(score>=25&&score<45){
	 		level=2;
	 	}else if(score>=45&&score<65){
	 		level=3;
	 	}
		var dataJson={userId:userId,score:score,level:level};  
		serviceInstance.callServer(dataJson,function(msg){
			if(msg.state="SUCCESS"){
				req.session.user.evaluateState=1;
				res.json({"score":score,"level":level}); 
			} 
		},function(msg){ 
			//接口的失败回调
			res.json(msg);
		},serviceEnumerationInstance.INVESTORRISKTEST,"POST");
	});

	/**跳转投资详情页面 获取用户信息 优惠卷信息 账户余额**/
	app.get('/investment/investmentDescriptionById', function(req, res){ 
		//获取跳转参数
	    var history = req.query.history;
	    req.session.historyPath = history;
	    //获取用户信息
	    var userInfo = req.session.user; 
	    //获取跳转参数ID
	    var targetid=req.query.id;
	     
		//所有函数异步，但都执行完成后传递结果给回调。
		async.parallel([
			function(resultCallBackFun){
				//获取用户数据
				if(req.session && userInfo){
					resultCallBackFun(null,{user:userInfo});
				}else{
					resultCallBackFun(null,{user:null});
				}
			},function(resultCallBackFun){ 
				//获取账户余额
				if(req.session && userInfo){ 
					serviceInstance.callServer( 
						{userId:userInfo.id},  
						function(msg){  
							if(msg.state=='SUCCESS'){  
								resultCallBackFun(null,{accountBalance:msg.data.balance,message:msg.message});
							}else{ 
								resultCallBackFun(null,{accountBalance:null,message:msg.message}); 
							}  
						},
						function(msg){  
							//接口的失败回调
							resultCallBackFun(null,{accountBalance:msg});

						},
						serviceEnumerationInstance.INVESTMENT_USER_BALANCE,
						"POST"
					);  
				}else{  
					resultCallBackFun(null,{accountBalance:null});
				} 
			},function(resultCallBackFun){
				//获取投资详情
				var userid='';
				if(req.session && userInfo){
					userid=userInfo.id;
				}  
				serviceInstance.callServer(
					{
						targetId:targetid
					},
					function(msg){
						resultCallBackFun(null,{investmentDesp:msg}); 
					},
					function(msg){
						//接口的失败回调
						resultCallBackFun(null,{investmentDesp:msg}); 
					},
					serviceEnumerationInstance.INVESTMENT_DISCRIPTION,
					"POST"
				);
			}
			// ,function(resultCallBackFun){
			// 	//获取优惠卷
			// 	var userid='';
			// 	if(req.session && userInfo){
			// 		userid=userInfo.id;
			// 	}   
			// 	serviceInstance.callServer(
			// 		{ 
			// 			userId:userid, 
			// 		},
			// 		function(msg){ 
			// 			resultCallBackFun(null,{bonuslist:msg}); 
			// 		},
			// 		function(msg){ 
			// 			//接口的失败回调
			// 			resultCallBackFun(null,{bonuslist:msg}); 
			// 		},
			// 		serviceEnumerationInstance.INVESTMENT_USER_COUPON,
			// 		"POST"
			// 	);
			// }
			,function(resultCallBackFun){
				//获取优惠卷数量
				if(req.session && userInfo){
					serviceInstance.callServer(
					{ 
						userId:userInfo.id, 
					},
					function(msg){ 
						resultCallBackFun(null,{bonuslength:msg.data.number}); 
					},
					function(msg){ 
						//接口的失败回调
						resultCallBackFun(null,{bonuslength:msg.data.number}); 
					},
					serviceEnumerationInstance.INVESTMENT_BONUS_COUNT,
					"POST"
				);
				}else{
					//未登录状态没有优惠券
					resultCallBackFun(null,{bonuslength:0});
				}
				
			}  
		],function(err,results){   
			res.render('investment/investmentDescription', { 
				title: keywords.websiteTitle,
				imageServer:config.imageServer.url,
				userInfo:userInfo,
				keywords:keywords.keywords,
				description:keywords.description,
				user:results[0].user,
				accountBalance:results[1].accountBalance,
				investmentDesp:results[2].investmentDesp,
				targetid:targetid, 
			    bonuslength:results[3].bonuslength
			});

		});
 
	   
	});

	//根据金额获取优惠卷
	app.get('/investment/getBonusListByAmount',function(req,res){
		//获取用户信息
	    var userInfo = req.session.user;  
	    //获取投资详情
		var userid='';
		var amount=req.query.amount; 
		var targetType=req.query.targetType; 

		if(req.session && userInfo){
			userid=userInfo.id;
		}   
		serviceInstance.callServer(
			{ 
				userId:userid,  
				amount:amount,
				targetType:targetType
			},
			function(msg){ 
				res.json(msg); 
			},
			function(msg){ 
				//接口的失败回调
				res.json(msg);  
			},
			serviceEnumerationInstance.INVESTMENT_USER_COUPON,
			"POST"
		); 
	});

	//获取投资详情中的剩余可投金额
	app.get('/investment/investmentDesp',function(req,res){
		//获取用户信息
	    var userInfo = req.session.user; 
	    //获取跳转参数ID
	    var targetid=req.query.id;
	    //获取投资详情
		var userid='';
		if(req.session && userInfo){
			userid=userInfo.id;
		}  
		serviceInstance.callServer(
			{
				targetId:targetid,
				userId:userid, 
			},
			function(msg){
				res.json(msg); 
			},
			function(msg){
				//接口的失败回调
				res.json(msg);  
			},
			serviceEnumerationInstance.INVESTMENT_DISCRIPTION,
			"POST"
		); 
	});
	//查询投资产品分页方法
	app.get('/investment/findInvestListByPage', function(req, res){
		//排序方式
		var sort = req.query.sort;
		//页码
		var page = req.query.page;
		//每页条数
		var rows = req.query.rows;
		//类型
		var swDklx=req.query.swDklx;
		//期限
		var swFkqx=req.query.swFkqx;
		//利率
		var rate=req.query.rate;
		//状态
		var targetState=req.query.targetState;  
		var dataJson={page:page,rows:rows,sort:sort};
		if(swDklx!=""){
			dataJson.productid=swDklx;
		}
		if(swFkqx!=""){
			dataJson.dateRange=swFkqx; 
		}
		if(rate!=""){
			dataJson.rateRange=rate;
		}
		if(targetState!=""){
			dataJson.targetState=targetState; 
		}
		serviceInstance.callServer(dataJson,function(msg){ 
			res.json(msg);
		},function(msg){ 
			//接口的失败回调
			res.json(msg);
		},serviceEnumerationInstance.INVESTMENT_LIST,"POST");
	});

	//查询还款计划分页方法
	app.get('/investment/repaymentPlanByPage', function(req, res){ 
	    //获取跳转参数ID
	    var targetid=req.query.targetId;
	    //页数
	    var page=req.query.page;
	    //显示的行数
	    var rows=req.query.rows;
 
	    //获取还款计划 
		serviceInstance.callServer(
			{
				targetId:targetid,
				page:page,
				rows:rows  
			},
			function(msg){ 
				res.json(msg);
			},
			function(msg){
				//接口的失败回调
				res.json(msg);
			},
			serviceEnumerationInstance.INVESTMENT_PAYBACK_PLAN,
			"POST"
		); 
	});

	//查询项目周期
	app.get('/investment/projectTimeNode', function(req, res){ 
	    //获取跳转参数ID
	    var targetid=req.query.targetId; 
 
	    //查询项目周期 
		serviceInstance.callServer(
			{
				targetId:targetid
			},
			function(msg){ 
				res.json(msg);
			},
			function(msg){
				//接口的失败回调
				res.json(msg);
			},
			serviceEnumerationInstance.PROJECTTIMENODE,
			"POST"
		); 
	});

	//查询投资记录分页方法
	app.get('/investment/investmentRecordByPage', function(req, res){
	 
	    //获取跳转参数ID
	    var targetid=req.query.targetId;
	    //页数
	    var page=req.query.page;
	    //显示的行数
	    var rows=req.query.rows;

	    //获取还款计划 
		serviceInstance.callServer(
			{
				targetId:targetid,
				page:page,
				rows:rows  
			},
			function(msg){
				res.json(msg);
			},
			function(msg){
				//接口的失败回调
				res.json(msg);
			},
			serviceEnumerationInstance.INVESTMENT_INVESTRECORD,
			"POST"
		); 
	});

	//获取预期收益
	app.get('/investment/expectedYield', function(req, res){ 
	    //金额
	    var inputMoney=req.query.inputMoney; 
	    //标的ID
	    var targetId=req.query.targetId;
	    // 预期收益 
		serviceInstance.callServer(
			{ 
				amount:inputMoney,
				targetId:targetId
			},
			function(msg){  
				res.json(msg);
			},
			function(msg){ 
				//接口的失败回调
				res.json(msg);
			},
			serviceEnumerationInstance.INVESTMENT_EXPECTED_INCOME,
			"POST"
		); 
	});

	//获取优惠卷接口
	app.get('/investment/userCoupon', function(req, res){ 
	    //用户ID
	    var userId=req.query.userId; 
	    var userInfo = req.session.user; 
	    if(req.session && userInfo){
			userId=userInfo.id;
		}   
		serviceInstance.callServer(
			{ 
				userId:userId  
			},
			function(msg){ 
				res.json(msg);
			},
			function(msg){
				//接口的失败回调
				res.json(msg);
			},
			serviceEnumerationInstance.INVESTMENT_BONUS_COUNT,
			"POST"
		); 
	});

	//立即投资保存
	app.post('/investment/rightnowSubmit',function(req, res){
	    
	    // var inviteCode = req.body.inviteCode;
	    var targetId = req.body.targetId; //标的ID 
		var amoumt= req.body.amoumt; //投资金额
		var loanNumber= req.body.loanNumber; //借款编号 
		var bonusId= req.body.bonusId; //优惠卷ID  

	    var userID=req.query.userId; 
	    var userInfo = req.session.user; 
	    if(req.session && userInfo){
			userID=userInfo.id;
		}    
        serviceInstance.callServer({
        	userId:userID,
        	targetId:targetId,
        	buyAmt:parseFloat(amoumt), 
        	bonusId:bonusId,
        	plantfrom:'1',//订单来源PC
        	chanel:'1'//订单来源PC
        },
        //成功回调
        function(msg){ 
           	res.json(msg);
          //失败回调
        },function(msg){
           	res.json(msg); 
        },
        serviceEnumerationInstance.INVESTMENT_SUBMIT);
	    
	});

};