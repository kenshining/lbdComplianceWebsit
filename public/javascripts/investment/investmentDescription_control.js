var rows=10;
var visiblePages=5;
var commonUtils=new CommonUtils(); 
var dataDic=new DataDictionary();
//更新剩余可投金额
var reloadResultAmount=function(container,targetid){
	$.lbdAjax({
		url	:'/investment/investmentDesp',
		type:'GET',
		dataType:'JSON',
		data:{ 
			id:targetid, 
			_csrf:$("#_csrf").val()
		},
		success:function(msg){ 
			if(msg.state=='SUCCESS'){
				var data=msg.data; 
				var resultAmonut=data.resultAmonut.toString().formatMoney();  
				$("#"+container).html(resultAmonut);
			}else{
				layer.msg(JSON.stringify(msg.message));
			} 
		},
		error:function(msg){  
			layer.msg(JSON.stringify(msg.message)); 
		}
	}); 
}
//查询还款计划列表
var getInvestmentPlanByPage=function(page,targetid){ 
	$.lbdAjax({
		url	:'/investment/repaymentPlanByPage',
		type:'GET',
		dataType:'JSON',
		data:{
			page:page,
			rows:rows,
			targetId:targetid, 
			_csrf:$("#_csrf").val()
		},
		success:function(msg){ 
			if(msg.state=='SUCCESS'){
				var data=msg.data;   
				repaymentPlanRander(data.content,(data.number+1)); 
				if(data.content.length!=0){
					$.jqPaginator("#repayment_pager",{
			            totalPages : data.totalPages,
			            visiblePages: visiblePages,
			            currentPage: (data.number+1),
			            totalnum:data.totalElements,
			            onPageChange: function (num, type) {
			                getInvestmentPlanByPageChange(num,targetid);
			            }
			        });
				}   
			}else{
				layer.msg(JSON.stringify(msg));
			} 
		},
		error:function(msg){ 
			layer.msg(JSON.stringify(msg));

		}
	}); 
};
//点击分页查询还款计划
var getInvestmentPlanByPageChange=function(page,targetid){ 
	$.lbdAjax({
		url	:'/investment/repaymentPlanByPage',
		type:'GET',
		dataType:'JSON',
		data:{
			page:page,
			rows:rows,
			targetId:targetid,
			_csrf:$("#_csrf").val()
		},
		success:function(msg){ 
			if(msg.state=='SUCCESS'){
				var data=msg.data;
				repaymentPlanRander(data.content,(data.number+1));  
			}else{
				// msg.message;
			} 
		},
		error:function(msg){ 
			layer.msg(JSON.stringify(msg));

		}
	}); 
};
//渲染还款计划
var repaymentPlanRander=function(repaymentPlan,currentPageNumber){
	var html='';
	$('#repaymentPlanlist').html(html);  
	if(repaymentPlan.length==0){ 
		html+='<tr>';
		html+='<td colspan="7">';
		html+='<div class="contentNullImg"></div>';
		html+='<div class="contentNullText">暂无还款计划</div>';
		html+='</td>';
		html+='</tr>'; 
		$('#repaymentPlanlist').html(html);   
	}
	else{
		for(var i=0;i<repaymentPlan.length;i++){ 
			var index=i%2;
			//当前期数
			// var nowqs=repaymentPlan[i].nowqs==undefined?0:repaymentPlan[i].nowqs;  
			//总期数 
			var qs=repaymentPlan[i].qs==undefined?0:repaymentPlan[i].qs; 
			var view_qs=qs;
			//还款本息(元) 
			var bx=repaymentPlan[i].bx==undefined?0:repaymentPlan[i].bx.toString().formatMoney();
			//还款本金(元)
			var bj=repaymentPlan[i].bj==undefined?0:repaymentPlan[i].bj.toString().formatMoney(); 
			//还款利息(元)
			var lx=repaymentPlan[i].lx==undefined?0:repaymentPlan[i].lx.toString().formatMoney(); 
			//还款日期 
			var yhkr=repaymentPlan[i].yhkr==undefined?'':repaymentPlan[i].yhkr.toString().split(' ')[0]; 
			//还款状态  0.待还款 1.已完成 2.逾期  3.逾期已结清 4.未到期
			var stateindex=repaymentPlan[i].state==undefined?'':repaymentPlan[i].state;
			var state="";
			if(stateindex==1){
				state="已还款";
			}else{
				state="未还款";
			} 
			//序号
			var number=(currentPageNumber-1)*rows+(i+1);
			
			if(index==0){
				html+='<tr class="odd">'; 
			}
			if(index==1){
				html+='<tr class="even">';
			}  
			html+='<td>'+number+'</td>';
			html+='<td>'+view_qs+'</td>';
			html+='<td>'+bx+'</td>';
			html+='<td>'+bj+'</td>';
			html+='<td>'+lx+'</td>';
			html+='<td>'+yhkr+'</td>';
			html+='<td>'+state+'</td>';
			html+='</tr>'; 
		}
		$('#repaymentPlanlist').html(html);
	}

	//给中间部分加最小高度
	setPageMinHeight(); 
};
//查询投资记录列表
var getInvestmentRecordByPage=function(page,targetid){ 
	$.lbdAjax({
		url	:'/investment/investmentRecordByPage',
		type:'GET',
		dataType:'JSON',
		data:{
			page:page,
			rows:rows,
			targetId:targetid,
			_csrf:$("#_csrf").val()
		},
		success:function(msg){ 
			if(msg.state=='SUCCESS'){
				var data=msg.data; 
				$('#investmentNum').html(data.totlePerson);
				var totleAmt=data.totleAmt==undefined?'0':data.totleAmt;
				$('#investmentMoney').html('￥'+totleAmt.toString().formatMoney());  
				investmentRecordRander(data.content); 
				if(data.content.length!=0){
					$.jqPaginator("#investment_record_pager",{
			            totalPages : data.totalPages,
			            visiblePages: visiblePages,
			            currentPage: (data.number+1),
			            totalnum:data.totalElements,
			            onPageChange: function (num, type) {
			                getInvestmentRecordByPageChange(num,targetid);
			            }
			        });
				} 
			}else{ 
				layer.msg(JSON.stringify(msg)); 

			} 
		},
		error:function(msg){ 
			layer.msg(JSON.stringify(msg)); 
		}
	});
};
//点击分页查询投资记录
var getInvestmentRecordByPageChange=function(page,targetid){
	$.lbdAjax({
		url	:'/investment/investmentRecordByPage',
		type:'GET',
		dataType:'JSON',
		data:{
			page:page,
			rows:rows,
			targetId:targetid,
			_csrf:$("#_csrf").val()
		},
		success:function(msg){ 
			if(msg.state=='SUCCESS'){
				var data=msg.data; 
				investmentRecordRander(data.content);  
			}else{
				layer.msg(JSON.stringify(msg));  
			} 
		},
		error:function(msg){ 
			layer.msg(JSON.stringify(msg)); 
		}
	});
};
//渲染投资记录
var investmentRecordRander=function(investmentRecord){ 
	var html='';
	$('#investmentRecordList').html(html); 
	if(investmentRecord.length==0){
		html+='<tr>';
		html+='<td colspan="7">';
		html+='<div class="contentNullImg"></div>'; 
		html+='<div class="contentNullText">暂无投资记录</div>';
		html+='</td>';
		html+='</tr>'; 
		$('#investmentRecordList').html(html);     
	}
	else{ 
		for(var i=0;i<investmentRecord.length;i++){
			//手机号 
			var telephone=investmentRecord[i].telephone==undefined?'':investmentRecord[i].telephone;
			//投资金额
			var buyAmt=investmentRecord[i].buyAmt==undefined?0:investmentRecord[i].buyAmt.toString().formatMoney();
			var createdDate=investmentRecord[i].createdDate==undefined?'':investmentRecord[i].createdDate;
			//手机号旁边图片对应的ID   1 pc端 2 微信 3 app端
			var chanel=investmentRecord[i].chanel==undefined?'':investmentRecord[i].chanel;
			var index=i%2; 
			if(index==0){
				html+='<tr class="odd">'; 
			}
			if(index==1){
				html+='<tr class="even">';
			}  

			//电话  
	 	 	var regmobile=/^(.{3}).+$/;
	 	 	var newTelephone=telephone;
	 	 	if(telephone!=''){ 
	 	 		newTelephone=telephone.replace(regmobile,'$1********')
	 	 	} 
			html+='<td style="position:relative;">'+newTelephone; 
			if(chanel==1&&telephone!=''){
				html+='<span class="icon invest_source icon-lcomputer">';
				html+='<div class="pronametip_hover hide">';
				html+='<div class="arrow_border"></div>';
				html+='<div class="arrow_border_trans"></div>';
				html+='<div class="arrow_text">pc端投资</div>'; 
				html+='</div>';
				html+='</span>';
			}else if(chanel==2&&telephone!=''){
				html+='<span class="icon invest_source icon-lweixin">';
				html+='<div class="pronametip_hover hide">';
				html+='<div class="arrow_border"></div>';
				html+='<div class="arrow_border_trans"></div>';
				html+='<div class="arrow_text">微信端投资</div>'; 
				html+='</div>';
				html+='</span>';
			}else if(chanel==3&&telephone!=''){
				html+='<span class="icon invest_source icon-lphone">';
				html+='<div class="pronametip_hover hide">';
				html+='<div class="arrow_border"></div>';
				html+='<div class="arrow_border_trans"></div>';
				html+='<div class="arrow_text">手机投资</div>'; 
				html+='</div>';
				html+='</span>';
			}else{

			}
			html+='</td>';
			html+='<td>'+buyAmt+'</td>';
			html+='<td>'+createdDate+'</td>';
			html+='</tr>'; 
		}
		$('#investmentRecordList').html(html);
	}

	//给中间部分加最小高度
	setPageMinHeight(); 
};

//查询项目周期
var getProjectCycel=function(targetid){
	//查询赋值
	$.lbdAjax({
		url	:'/investment/projectTimeNode',
		type:'GET',
		dataType:'JSON',
		data:{ 
			targetId:targetid,
			_csrf:$("#_csrf").val()
		},
		success:function(msg){ 
			var data=msg.data;
			//开始时间 
			if(data.startTime=='未开始'){ 
				$("#cycleStartTime").find('.point').addClass('pointgray');  
				$("#cycleStartTime").find('.iconStart').addClass('iconStartGray'); 
				$("#cycleStartTime").find('.timeValue').html('未开始');

			}else{
				$("#cycleStartTime").find('.point').removeClass('pointgray');   
				$("#cycleStartTime").find('.iconStart').removeClass('iconStartGray');  
				$("#cycleStartTime").find('.timeValue').html(data.startTime);
			}
			//募集时长 
			if(data.duration=='未开始'){
				$("#cycleDuration").find('.point').addClass('pointgray');
				$("#cycleDuration").find('.iconRaise').addClass('iconRaiseGray');
				$("#cycleDuration").find('.timeValue').html('未开始');

			}else{ 
				$("#cycleDuration").find('.point').removeClass('pointgray');    
				$("#cycleDuration").find('.iconRaise').removeClass('iconRaiseGray'); 
				$("#cycleDuration").find('.timeValue').html(data.duration);
			}
			//放款时间 
			if(data.lendingDay=='未开始'){
				$("#cycleLendingDay").find('.point').addClass('pointgray');
				$("#cycleLendingDay").find('.iconLoan').addClass('iconLoanGray'); 
				$("#cycleLendingDay").find('.timeValue').html('未开始');
			}else{
				$("#cycleLendingDay").find('.point').removeClass('pointgray');     
				$("#cycleLendingDay").find('.iconLoan').removeClass('iconLoanGray');
				$("#cycleLendingDay").find('.timeValue').html(data.lendingDay);
			}
			//还款期限 
			if(data.deadline=='未开始'){
				$("#cycleDeadline").find('.point').addClass('pointgray');
				$("#cycleDeadline").find('.iconRepay').addClass('iconRepayGray'); 
				$("#cycleDeadline").find('.timeValue').html('未开始');

			}else{
				$("#cycleDeadline").find('.point').removeClass('pointgray');      
				$("#cycleDeadline").find('.iconRepay').removeClass('iconRepayGray'); 
				$("#cycleDeadline").find('.timeValue').html(data.deadline);
			}  
		},
		error:function(msg){ 
			layer.msg(JSON.stringify(msg)); 
		}
	});

	//给中间部分加最小高度
	setPageMinHeight(); 
}
//验证投资金额是否正确
var validateInvestmentAmount=function(value){ 
	//原始剩余可投金额
	var resultAmonutOrigin=$("#resultAmonutOrigin").val(); 
	//起投金额 
	var startMoney=100; 
	//计算剩余可投金额 
	var residualInvestmentAmount=commonUtils.floatSub(resultAmonutOrigin,value); 
	
	var reg=/^[0-9]+(\.{0,1}[0-9]{1,2})?$/g;
 
 	if((value-0)==resultAmonutOrigin){  
		correctEvent(); 
		return true; 
	} 
	if(!reg.test(value)){  
		errorEvent('投资金额格式错误');
		return false;  
	} 
	if(residualInvestmentAmount<startMoney&&residualInvestmentAmount>0){
		errorEvent('剩余可投金额不可低于¥100'); 
		return false; 
	} 
	if(residualInvestmentAmount<0){
		errorEvent('投资金额不能大于剩余可投金额'); 
		return false; 
	} 
	if(value<startMoney){
		errorEvent('起投金额￥100');  
		return false; 
	} 
	if(value>startMoney&&value%10){
		errorEvent('金额必须为10的整数倍且不少于¥100');  
		return false; 
	} 
	correctEvent(); 
	return true;
};
//验证错误提示
var errorEvent=function(text){ 
	$('#errorText').removeClass('invisibility').addClass('visibility');
	$('#errorText').html(text);
	$('.money_input').addClass('error');
	$("#planYield").html("--");  
};
//验证正确恢复样式
var correctEvent=function(){
	$('#errorText').removeClass('visibility').addClass('invisibility');
	$('.money_input').removeClass('error');  
}; 
/*slider*/ 
var rewardSlider = function(opt){ 
	var sliderEle = $(opt.id);
	var row = opt.row == undefined ? 1 : opt.row; //行数
	var col = opt.col == undefined ? 1 : opt.col; //列数，每次移动的距离
	var sliderItemW = sliderEle.find('.slider_item').eq(0).outerWidth(true);
	var sliderItemSize = sliderEle.find('.slider_item').size();
	var sliderW = sliderItemW*(Math.ceil(sliderItemSize/row));
	var moveEle = sliderEle.find('.slider_item_wrapper');

	//设置slider_item_wrapper的宽度
	moveEle.css('width',sliderW+'px');

	//点击left
	var step = 0;
	sliderEle.on('click','#right_arrow',function(){
		$('#slider_wrapper').find('#left_arrow').css(
			'background', 'url(/dist/images/larrowleft-light.png) no-repeat center center'
		)
		step ++;
		var size = Math.ceil(sliderItemSize/row/col);
		if(step >= size-1){
			step = size-1;
			$('#slider_wrapper').find('#right_arrow').css(
				'background','url(/dist/images/larrowright.png) no-repeat center center'
			)
		}
		move(step);
	});
	sliderEle.on('click','#left_arrow',function(){
		$('#slider_wrapper').find('#right_arrow').css(
			'background','url(/dist/images/larrowright-light.png) no-repeat center center'
		)
		step --;
		if(step<=0){
			step = 0;
			$('#slider_wrapper').find('#left_arrow').css(
				'background', 'url(/dist/images/larrowleft.png) no-repeat center center'
			)
		}
		move(step);
	});
	function move(step){
		moveEle.animate({'left':-sliderItemW*col*step},500);
	} 
}; 
//修改页面未计算的值 
var updateHtmlValue=function(){ 
 	 	//历史借款金额
 	 	$('.swfkje').each(function(){
 	 		var val = $(this).html()==undefined?'0.00':$(this).html().toString().formatMoney();
 	 		$(this).html(val);
 	 	});  

 	 	//历史借款  预期年化收益率  
 	 	$('.history_nhsyl').each(function(){ 
 	 		var nhsyl=$(this).html().toString(); 
 	 		var val = commonUtils.floatMul(nhsyl,100); 
 	 		$(this).html(val+'%');
 	 	});

 	 	//预期年化收益率  floatMul  
	  	var rate=$('#rate').data('value')==undefined?'0':(commonUtils.floatMul($('#rate').data('value'),100)).toString();
	  	var rateback= $('#rateback').data('value')==undefined?'0':$('#rateback').data('value');
	  	var firstRate='';
	  	var decimalRate='';
	  	var secondRate='';  
	  	if(rate=='0'){
	  		firstRate=0;
	  		secondRate=0;
	  	}else{
	  		firstRate=rate.split('.')[0]; 
			decimalRate=rate.split('.')[1]==undefined?'':'.'+rate.split('.')[1];
			if(rateback==0){
				secondRate=decimalRate+'<span class="percent">%</span>';  
			}else{
				secondRate=decimalRate+'+'+rateback+'<span class="percent">%</span>';  
			}
	  	} 
	  	$('#rate').html(firstRate);
 	 	$('#rateback').html(secondRate);
 	 	//待还本息  	 
		var desp_money=$('.desp_money').html()==undefined?'0':$('.desp_money').html(); 
 	 	$('.desp_money').html("￥"+desp_money.formatMoney());	 

 	 	//账户可用余额
 	 	var accountBalance=$('#accountBalance').html()==undefined?'￥0.00':$('#accountBalance').html();  
 	 	$('#accountBalance').html('￥'+accountBalance.formatMoney());	

 	 	//年龄
 	 	// var birthday=$('#userage').html();
 	 	// $('#userage').html('19');

 	 	//借款金额 
 	 	var borrowMoney=$('#borrowMoney').data('value')==undefined?'0':$('#borrowMoney').data('value').toString(); 
 	 	$('#borrowMoney').html(borrowMoney.formatMoney());

 	 	//剩余可投金额 
 	 	var resultAmonut=$('#resultAmonut').data('value')==undefined?'0':$('#resultAmonut').data('value').toString(); 
 	 	$('#resultAmonut').html(resultAmonut.formatMoney());
 	 	//月收入
 	 	var moneyByMonth=$('#moneyByMonth').html()==undefined?'0':$('#moneyByMonth').html(); 
 	 	$('#moneyByMonth').html('￥'+moneyByMonth.formatMoney());
 	 	//年收入
 	 	var moneyByYear=$('#moneyByYear').html()==undefined?'0':$('#moneyByYear').html();
 	 	$('#moneyByYear').html('￥'+moneyByYear.formatMoney());
 	 	//信用额度
 	 	var creditLine=$('#creditLine').html()==undefined?'0':$('#creditLine').html();
 	 	$('#creditLine').html('￥'+creditLine.formatMoney());
 	 	// 逾期金额
 	 	var pastDue=$('#pastDue').html()==undefined?'0':$('#pastDue').html();
 	 	$('#pastDue').html('￥'+pastDue.formatMoney());
 	 	//待还本息：
 	 	var toRepay=$('#toRepay').html()==undefined?'0':$('#toRepay').html();
 	 	$('#toRepay').html('￥'+toRepay.formatMoney());
 	 	//借款总额
 	 	var borrowTotal=$('#borrowTotal').html()==undefined?'0':$('#borrowTotal').html();
 	 	$('#borrowTotal').html('￥'+borrowTotal.formatMoney()); 

 	 	//户籍所在地  现居住地 工作地点 都显示到市之前
 	 	var hjaddress=$('#hjaddress').html()==undefined?'':$('#hjaddress').html();  
 	 	$('#hjaddress').html(formatAddress(hjaddress));

 	 	var xxjzaddress=$('#xxjzaddress').html()==undefined?'':$('#xxjzaddress').html();  
 	 	$('#xxjzaddress').html(formatAddress(xxjzaddress));

 	 	var workAddress=$('#workAddress').html()==undefined?'':$('#workAddress').html();  
 	 	$('#workAddress').html(formatAddress(workAddress)); 

 	  
	   	//姓名
 	 	var realname=$('#realname').html()==undefined?'':$('#realname').html(); 
 	 	var regName=/^(.{1}).+$/;
 	 	if(realname!=''){ 
 	 		$('#realname').html(realname.replace(regName,'$1**'));
 	 	} 
 	 	//身份证
 	 	var idcard=$('#idcard').html()==undefined?'':$('#idcard').html().replace(/\s+/g,"");;
 	 	var regIDcard=/^(.{3}).{15}$/;
 	 	if(idcard!=''){ 
 	 		$('#idcard').html(idcard.replace(regIDcard,'$1**************'));
 	 	}
 	 	//电话 
 	 	var mobile=$('#mobile').html()==undefined?'':$('#mobile').html();
 	 	var regmobile=/^(.{3}).+$/;
 	 	if(mobile!=''){ 
 	 		$('#mobile').html(mobile.replace(regmobile,'$1********'));
 	 	}

 	 	//工作单位显示
 	 	$('.workUnit').on('mouseover',function(){  
 	 		var width=$(this).find('span').width();
 	 		if(width>168){
 	 			$('#workUnitTip').addClass('show').removeClass('hide'); 
 	 		}
 	 	});
 	 	$('.workUnit').on('mouseout',function(){
 	 		$('#workUnitTip').addClass('hide').removeClass('show'); 
 	 	});
 	 	
}; 
//地址格式化字符串 直到市
var formatAddress=function(address){
	var arrayStr='';
	if(address!=''){
		arrayStr=address.split('市')[0]+"市";
	}
	return arrayStr;
};
//优惠卷显示
var couponListView=function(couponList,dialogStr){ 
	// console.log(couponList);
	 
	/*使用奖券，红包部分*/
	dialogStr += '<div class="reward">'
			  +"<h2>使用奖励<span class='orange' id='reward_money_show'>未选中奖励</span></h2>"
			  +"<div class='invet_reward_slider_box' id='slider_wrapper'>"
			  +"<span class='icon-left icon' id='left_arrow'></span>"
			  +"<span class='icon-right icon' id='right_arrow'></span>"
			  +"<div class='invet_reward_slider_wrapper '>"
			  +"<ul class='invet_reward_slider slider_item_wrapper'>";
	console.log(couponList);
	for(var i=0;i<couponList.length;i++){  
		var coupon=couponList[i];    
		var beginTime=coupon.begin_time==undefined?'':coupon.begin_time.split(' ')[0];
		var endTime=coupon.end_time==undefined?'':coupon.end_time.split(' ')[0]; 
		var bonusid=coupon.id; 
		var type=coupon.type; 
		//奖励类型   
		var title=commonUtils.floatMul((coupon.value-0),(dataDic.dicRewardType(type)[3])); 
		var typename=dataDic.dicRewardType(type)[0];
		var selectTypename=dataDic.dicRewardType(type)[1];
		//单位
		var unit=dataDic.dicRewardType(type)[2];  
		dialogStr +="<li class='icon-zh-reward slider_item' data-type='"+type+"' data-flag='false' data-id='"+bonusid+"' data-money='"+title+"' data-unit='"+unit+"' data-selectname='"+selectTypename+"'>"
					+"<div class='t'>"
					+"<div class='left'><em>"+title+"</em>"+unit+"<br>"+typename+"</div>"
					+"<ol class='use_conditions right'>"
					+"<li>使用条件：<li/>"
					+"<li>投资≥"+coupon.amount+"</li>"
					+"<li>期限≥"+coupon.deadline+"</li>"
					+"</ol>"
					+"</div>"
					+"<p class='use_date'>使用期限:"
					+"<span>"+beginTime+"~"+endTime+"</span></p>"
					+"<div class='reward_mask icon-zh-mask'></div>"
					+"<div class='icon-zh-ok hide'></div>"
					+"</li>";

		// dialogStr +="<div class='reward_mask icon-zh-mask hide'></div>"
		// 		  +"<div class='icon-zh-ok'></div>"
		// 		  +"</li>";  
	} 
	dialogStr +='</ul></div></div>'+ 
			'</div>';

	return dialogStr;
};
//弹出投资确认页
var alertInvestmentConfirm=function(Param){  

	// Param.accountBalance=1000;

	var dialogStr = '<div class="mask">'
				  +'<div class="invet_dialog_wrapper dialog_wrapper">'
				  +'<div class="dialog_close_btn icon-zh-close"></div>'
				  +'<h2 class="title">投资确认</h2>'
				  +'<ul class="info">'
				  +"<li><span class='l'>借款编号：</span><span class='r'>"+Param.loanProgramName+"</span></li>"
				  +"<li><span class='l'>预期年化收益率：</span><span class='r' id='expectRate'>"+Param.expectReturnAnnualRate+"</span><span>%</span></li>"
				  +"<li><span class='l'>投资期限：</span><span class='r'>"+Param.investmentDeadline+"</span></li>"
				  +"<li><span class='l'>投资金额：</span><span class='r'>￥"+Param.investmentAmount.toString().formatMoney()+"</span></li>"
				  +"<li><span class='l'>还款方式：</span><span class='r'>"+Param.repaymentMethod+"</span></li>"
				  +"<li><span class='l'>计息方式：</span><span class='r'>"+Param.valueDate+"</span></li>"
				  +"</ul>";
 
	//有优惠卷则显示优惠卷
	if(Param.couponList.length>0){ 
		dialogStr=couponListView(Param.couponList,dialogStr);  
	}	 
	//+"<p><span class='l'>账户余额： </span><span class='orange'>￥"+Param.accountBalance.toString().formatMoney()+"</span></p>"
	//+"<p><span class='l'>应付金额： </span><span class='orange' id='accountPay'>￥"+Param.accountPay.toString().formatMoney()+"</span></p>"
	/*使用奖券，红包部分结束*/
	dialogStr +='<div class="bottom">'
			  +"<p><span class='l'>投资总金额：</span><span class='orange' id='allAmount'></span></p>" 
			  +"<div class='tip'>如遇流标情况，投标期内所冻结的金额将在流标后进行解冻。</div>"
			  +'<div class="ck_box">'
			  +'<div id="isAgree" class="icon-cked" data-agree="1"></div>'
			  +'我已同意并阅读<a class="orange" href="/agreement/bl_risk_protocol" target="_blank">《投资风险提示书》</a>'
			  +'<a class="orange" href="/agreement/sb_loan_protocol?targetId="'+$("#targetidHidden").val()+' target="_blank">《借款协议》</a>'
			  +'</div>'; 
	//立即充值
	/*余额不足时，立即充值按钮显示*/
	dialogStr +='<div class="btn_box hide" id="recharge_box">'
			  +'<div class="btn" id="recharge_btn">立即充值</div>'
			  +'<div class="_tip">余额不足，充值<span class="orange" id="diffValue">'+0+'元</span>后可立即投资</div>'
			  +'</div>'; 
	//立即投资 
	dialogStr +='<div class="btn_box hide" id="invest_box"><div class="btn" id="invest_btn">立即投资</div></div>'
			  +'</div></div></div>';
 	 	
 	 	  
	Dialog = $.dialog({
			dialogDom:dialogStr,
			isClose:true
	});
	$('.dialog_close_btn').click(function(){
		Dialog.close();
	});  
 
	//账户余额
	var accountBalance=parseFloat(Param.accountBalance); 
	if(isNaN(accountBalance)){
		accountBalance=0;
	}
	//应付金额
	var accountPay=parseFloat(Param.accountPay); 
	if(isNaN(accountPay)){
		accountPay=0;
	} 

	if(accountBalance<accountPay){
		var diff=accountPay-accountBalance;
		//立即充值
		/*余额不足时，立即充值按钮显示*/ 
		$("#recharge_box").show();
		$("#invest_box").hide(); 
		$("#diffValue").html(diff.toString().formatMoney());
	}else{
		$("#recharge_box").hide();
		$("#invest_box").show(); 
	}
 		
	// //默认显示第一个的内容
	var $li1=$('.slider_item_wrapper .bonusSelected'); 
	// $('#reward_money_show').text('已选中'+$li1.data('money')+$li1.data('unit')+$li1.data('selectname'));
	if ($li1.data('money')) {
		var allAmount=parseInt(Param.accountPay)+$li1.data('money'); 
		$('#allAmount').html("￥"+allAmount.toString().formatMoney());
	}else{
		$('#allAmount').html("￥"+parseInt(Param.accountPay).toString().formatMoney());
	}
	

	$('.slider_item_wrapper').on('click','.slider_item',function(){ 
	  
		if(!($(this).attr('data-flag')=='true')){  
			$(this).attr('data-flag','true');
			$(this).siblings().attr('data-flag','false');

			//修改样式
		 	$(this).find('.icon-zh-mask').hide();
			$(this).find('.icon-zh-ok').show(); 
			$(this).siblings().find('.icon-zh-mask').show();
			$(this).siblings().find('.icon-zh-ok').hide();

			var rewardMoney = $(this).data('money');

			var unit=$(this).data('unit');
			var selectname=$(this).data('selectname');
			$('#reward_money_show').text('已选中'+rewardMoney+unit+selectname);
 			
 			var type=$(this).data('type');
 			if(type==1){
 				var allAmount=parseInt(Param.accountPay)+rewardMoney;
				$('#allAmount').html("￥"+allAmount.toString().formatMoney());
 				$('#expectRate').html(Param.expectReturnAnnualRate);
 			}else if(type==2){
 				var expectRate=commonUtils.floatAdd(Param.expectReturnAnnualRate,rewardMoney)

 				// console.log(expectRate+"  "+Param.expectReturnAnnualRate+"  "+rewardMoney); 
 				$('#expectRate').html(expectRate);

 				var allAmount=parseInt(Param.accountPay); 
				$('#allAmount').html("￥"+allAmount.toString().formatMoney()); 
 			}
 
			
			$(this).addClass('bonusSelected').siblings().removeClass('bonusSelected');

		}else{
			$(this).removeClass('bonusSelected').siblings().removeClass('bonusSelected'); 
			$(this).attr('data-flag','false');
			$(this).siblings().attr('data-flag','false');
			//修改样式
			$(this).find('.icon-zh-mask').show();
			$(this).find('.icon-zh-ok').hide(); 
			$(this).siblings().find('.icon-zh-mask').show();
			$(this).siblings().find('.icon-zh-ok').hide();

			var rewardMoney = 0;
			// var unit=$(this).data('unit');
			// var selectname=$(this).data('selectname');
			$('#reward_money_show').text('未选中奖励'); 
			var type=$(this).data('type');
			 
 			var allAmount=parseInt(Param.accountPay); 
			$('#allAmount').html("￥"+allAmount.toString().formatMoney()); 
 			$('#expectRate').html(Param.expectReturnAnnualRate);
			

			  
		}  
		if(accountBalance<accountPay){
			$("#recharge_box").show();
			$("#invest_box").hide(); 
			$('#diffValue').html((accountPay-accountBalance).toString().formatMoney()); 
		}else{
			$("#recharge_box").hide();
			$("#invest_box").show(); 
		}
	}); 

	//是否同意协议
	$("#isAgree").on('click',function(){
		var data_agree=$(this).attr('data-agree');  
		if(data_agree=="1"){  
			$(this).addClass('icon-noagree').removeClass('icon-cked');
			$(this).attr('data-agree','0');
		}else{ 
			$(this).addClass('icon-cked').removeClass('icon-noagree');
			$(this).attr('data-agree','1'); 
		}
	}); 

	//立即充值
	$("#recharge_btn").on('click',function(){
		location.href='/account/accountOverview?v=/account/chargeManagement/recharge&m=recharge_sub_m_btn';
	});		 
	//slide
	/*
		id: slider_wrapper元素，
		row:几行显示
		col:一次滑动几列
	*/
	rewardSlider({id:'#slider_wrapper',row:2,col:2});

};
//切换tab滑动效果
var switchTabSile=function(){ 
	var leftx;
 	var width; 
 	width=$(".investdesp_title div").width();
 	startleftx=(width-115)/2;
	$('.fixedBorder').css('left',startleftx); 
	$(".investdesp_title div").bind("click",function(){
		leftx=$(this).position().left+startleftx;  
		$('.fixedBorder').stop().animate({
			left: leftx,
			width: 115
		},300);  
	}); 
};
//倒计时
var callCountDown=function(targetState,hd_auto_bid_time,hd_manual_bid_time,server_time){
	var countdown_options = {
	    server_time: server_time,
	    auto_bid_time: hd_auto_bid_time,
	    manual_bid_time: hd_manual_bid_time,
	    callback: function(msg){ 
	    	//标的状态:1立即投资 2即将开放 3已满标 4还款中 5已完结 
	    	//type=1 即将开放  2 立即投资
	    	//同时判断标的状态和返回的type
	    	var strTime='';
	    	if(targetState==2&&msg.type==1){
	    	
	    		var startTime=hd_auto_bid_time; 
	    		strTime  = '<span class="desp_name">募集开始时间</span>'
	    				 + startTime;
	    	}else if(targetState==1&&msg.type==2){
	    		strTime  = '<span class="desp_name">募集剩余时间</span>'
	    				 + '<span class="value">'
	    				 + msg.data[0] 
	    				 + '</span>天<span class="value">' 
	    				 + msg.data[1] 
	    				 + '</span>时<span class="value">' 
	    				 + msg.data[2] 
	    				 + '</span>分<span class="value">' 
	    				 + msg.data[3] 
	    				 + '</span>秒';
	    	}else{ 
				var endTime=hd_manual_bid_time;

	    		strTime  = '<span class="desp_name">募集结束时间</span>'
	    				 + endTime;
	    	}
			$('#countDown').html(strTime);
    	}
	};
	var s=new CountDown(countdown_options);
	s.start();
};
//判断是否接口错误
if($("#errorText").val()){
	layer.msg(JSON.stringify($("#errorText").val()));
} 
//设置页面最小高
var setPageMinHeight=function(){  
	var pageH =$('.invest_webmap').height()+$('.invest_baseinfo').height()+ $('.investdesp_info').height()+280;
	 
	$('.invest_main').css('min-height',pageH+'px');	  
  
};
//判断是否绑卡
var validateIsAuth=function(){
	var flag=false; 
	$.lbdAjax({
		url	:'/account/user/auth',
		type:'POST',
		dataType:'JSON',
		async:false,
		data:{_csrf:$("#_csrf").val()},
		success:function(msg){  
			var auth=msg.msg.auth; 
			if(auth.indexOf(3)>-1){ 
				flag=true
			} 
		},
		error:function(msg){
			 
		}
	}); 
	return flag;
};
//获取优惠卷
var getBonusList=function(value){
	var data='';
	$.lbdAjax({
		url	:'/investment/getBonusListByAmount',
		type:'GET',
		dataType:'JSON',
		async:false,
		data:{
			amount:value,
			targetType:'1',
			_csrf:$("#_csrf").val()
		},
		success:function(msg){  
			if(msg.state=='SUCCESS'){
				data=msg.data;
				
			}else{
				console.log('error');
			} 
		},
		error:function(msg){ 
			console.log('error');
		}
	});
	return data;
};
var Dialog={};
var DialogSuccess={}; 
$(function(){    
	//变更主菜单样式   
	$('#header_nav').find('li').removeClass('select').end().find('#nav_header_investment_sub').addClass('select');

		//tab切换事件
	$(".investdesp_title div a").on("click",function(){ 
		var index=$(this).parent('div').index();
		$(this).parent('div').addClass('select').siblings().removeClass('select');
		$("#tab"+index).addClass('show').removeClass('hide').siblings().addClass('hide').removeClass('show');
		var targetid = $("#targetidHidden").val();
		if(index==0){
			//给中间部分加最小高度
			setPageMinHeight(); 
		}
		if(index==1){
			//查询项目周期
			getProjectCycel(targetid);
		}
		//判断切换为还款计划执行事件
		if(index==2){
			getInvestmentPlanByPage(1,targetid);
		}
		//判断切换为投资记录执行事件
		if(index==3){
			getInvestmentRecordByPage(1,targetid); 
		} 
	});

    //右侧图片轮播
    $('.pic_slide').bxSlider({
        infiniteLoop: false,
        minSlides: 3,
        maxSlides: 6,
        slideWidth: 154,
        slideMargin: 6,
        pager: false
    });
    //右侧图片放大展示
    var $img_group_index = $(".pic_slide");
    $.each($img_group_index, function(index, val) {
        var _index = $(this).attr("data-index");
        $(".pic_slide > li").not(".bx-clone").find(".fancybox"+_index).fancybox({
            helpers: {
                title: {
                    type: 'inside'
                },
                buttons: {}
            },
            afterLoad: function() {
                var _cur_title = "";
                var img_url = this.href; 
                for (var z = 0; z < this.group.length; z++) {
                    var el_href = $(this.group[z].element).attr('href');
                    if (img_url === el_href) {
                        _cur_title = $(this.group[z].element).attr("data-title"); 
                        break;
                    }
                }
                this.title = _cur_title + '&nbsp;&nbsp;&nbsp;&nbsp;' + (this.index + 1) + '\/ ' + this.group.length;
            }
        });
    });

    //鼠标滑动投资记录图标事件 
    $("#investmentRecordList").on('mouseover','.invest_source',function(){ 
    	$(this).find('.pronametip_hover').addClass('show').removeClass('hide');
    });
    //鼠标离开
    $("#investmentRecordList").on('mouseout','.invest_source',function(){ 
    	$(this).find('.pronametip_hover').addClass('hide').removeClass('show');
    });

     
    
	//倒计时
	//标的状态
    var targetState=$("#targetState").val();
    var hd_auto_bid_time=$("#hd_auto_bid_time").val();
    var hd_manual_bid_time=$("#hd_manual_bid_time").val();
    var hd_server_time=$("#hd_server_time").val(); 
	var server_time=hd_server_time.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/g,'$1/$2/$3 $4:$5:$6');
		callCountDown(targetState,hd_auto_bid_time,hd_manual_bid_time,server_time);


	//给中间部分加最小高度 
	setPageMinHeight(); 	 
		
 	//判断输入金额
 	$('#inputInvestMoney').on('input',function(){ 
 		var value=$(this).val(); 
 		$("#planYield").html("--"); 

 		if(value.length!=0){
			if(validateInvestmentAmount(value)){   
	 			//计算收益 
		 		$.ajax({
					url	:'/investment/expectedYield',
					type:'GET',
					dataType:'json',
					async:false,
					data:{
						inputMoney:value,
						targetId:$("#targetidHidden").val(), 	
						_csrf:$("#_csrf").val()
					},
					success:function(msg){    
						 var income=msg.data.income==undefined?0:(msg.data.income-0); 
						 income = income.toFixed(2);
						 $("#planYield").html("￥"+income); 
					},
					error:function(msg){ 
	 					$("#planYield").html("--");  
						layer.msg(JSON.stringify(msg));  
					}
				}); 
	 		}  
 		}else{
 			$("#planYield").html("--");  
 			correctEvent(); 
 		}
 	});
 	//金额符号显示
 	$("#inputInvestMoney").focus(function(){
		$(this).prev().addClass('visibility').removeClass('invisibility'); 
    });
    //判断输入金额失去焦点事件
  	$('#inputInvestMoney').on('blur',function(){  
  		var value=$(this).val();
  		if(value.length!=0){ 
  			var reg=/^(0+)([1-9]+(0*\.{0,1}[0-9]{1,2})?)$/; 
    		var newValue=value.replace(reg,'$2');  
  			if(validateInvestmentAmount(newValue)){  
  				var valueIntArr=newValue.split('.');
  				// console.log(valueIntArr) 
  				if(valueIntArr.length<2){
  					$(this).val(valueIntArr[0]+'.00');
  				}else if(valueIntArr.length==2){
  					if(valueIntArr[1]==""){
  						$(this).val(valueIntArr[0]+'.00');
  					}
  				} 
  			}
  		}else{
 			$("#planYield").html("--");  
  		}
  	});

 	//立即投资 
 	$('#btnImmediateInvest').on('click',function(){   
 		//判断是否登录
 		if($('#userInfo').val()){  
 			//判断是否绑卡
 			if(validateIsAuth()){
 				//判断是否参加过测评
 				var userEvaluateState=$('#userEvaluateState').val(); 
 				console.log(userEvaluateState);
 				if(userEvaluateState==1){
 					var value=$('#inputInvestMoney').val();   
			 		if(validateInvestmentAmount(value)){ 
			 			var rate=$('#rateConfirm').val()==undefined?0:commonUtils.floatMul($('#rateConfirm').val(),100);
			 			var investmentDeadline=$('#investmentDeadline').html()==undefined?0:$('#investmentDeadline').html();
			 			//判断账户余额是否为Float类型
			 			var accountBalance=parseFloat($('#accountBalance').attr('data-value'));
			 			if(isNaN(accountBalance)){
			 				accountBalance=0;
			 			}  
			 			//还款方式
			 			var repaymentMethod=$("#repaymentMethod").html();
			 			//获取优惠卷
			 			var couponList=getBonusList(parseInt(value)); 

			 			var loanNumber=$('#loanNumber').html();
			 			//显示的参数信息
			 			var investmentConfirmParam={
			 				loanProgramName:loanNumber, //借款项目名称
			 				expectReturnAnnualRate:rate, //预期年化收益率
			 				investmentDeadline:investmentDeadline+'个月', //投资期限
			 				investmentAmount:value, //投资金额
			 				repaymentMethod:repaymentMethod, //还款方式
			 				valueDate:'放款次日计息', //起息日期
			 				accountBalance:accountBalance, //账户余额
			 				accountPay:value, //应付金额
			 				couponList:couponList  //优惠卷 
			 			};
			 			//弹出框 获取值
						alertInvestmentConfirm(investmentConfirmParam);

						//提交立即投资 
						$('#invest_btn').on('click',function(){
							var data_agree=$('#isAgree').attr("data-agree"); 
							if(data_agree!="1"){
								layer.msg('请先阅读并同意《投资风险提示书》《借款协议》'); 
								 
							}else{
								var bonusid=$('.slider_item_wrapper .bonusSelected').attr("data-id");
								 //如果未选中奖励
								 if(bonusid==undefined){
								 	bonusid='';
								 } 
								 var loanNumber=$("#loanNumber").html(); 
								 //提交 
						 		 $.ajax({
									url	:'/investment/rightnowSubmit',
									type:'POST',
									dataType:'json',
									data:{ 
										targetId:$("#targetidHidden").val(), //标的ID
										userID:'',
										amoumt:value, //投资金额
										loanNumber:loanNumber,//借款编号 
										bonusId:bonusid,  //优惠卷ID  
										_csrf:$("#_csrf").val()
									},
									beforeSend: function(){ 
								     	//提交中。。。
								 		$('#invest_btn').html("提交中...");   
								    },
									success:function(msg){  
										// console.log(msg);
										 if(msg.state=="SUCCESS"){ 
										 	Dialog.close();
										   //弹出成功窗口
									 	   DialogSuccess =$.dialog({
											      dialogDom:'<div class="dialog_close_btn icon-zh-close"></div><div class="ok icon-ok"></div><p class="orange">恭喜您，投资成功！</p><div class="dialogbtn"><a href="/account/accountOverview?v=/account/chargeManagement/tradeRecord&m=tradeRecord_sub_m_btn">查看交易记录</a><a href="/investment/investmentList">继续投资</a></div>',
											      className:'dialog_box',
											      isClose:true
											    });
											  $('.dialog_close_btn').click(function(){
											    DialogSuccess.close();
											});
										 }else{ 
										 	layer.msg(JSON.stringify(msg.message)); 
											Dialog.close();   
										 } 
										//刷新余额 优惠卷  剩余可投金额
									 	refreshAccountBanlance('accountBalance');
									 	refreshAccountCoupon('bonusLength');  
									 	reloadResultAmount("resultAmonut",$("#targetidHidden").val()); 
									},
									complete: function () {
								     	  
								    },
									error:function(msg){  
										layer.msg(JSON.stringify(msg));  
										Dialog.close();
										//刷新余额 优惠卷  剩余可投金额
									 	refreshAccountBanlance('accountBalance');
									 	refreshAccountCoupon('bonusLength');
									 	reloadResultAmount("resultAmonut",$("#targetidHidden").val());  
									}
								 }); 
							} 
						});
			 		}
 				}else{  
 					//提示测评弹出框
	 				var tipRiskTestDialog = $.dialog({
					    dialogDom:'<div class="ok icon-fail"></div><p>您尚未参加投资者风险评估测评！</p><p>必须参加测评才可以投资哦～</p><div class="dialogbtn"><a href="/investment/investorRiskAssessmentTest?history=/investment/investmentDescriptionById?id='+$("#targetidHidden").val()+'">立即测评</a><a class="closeBtn" href="javasript:void(0);">稍后在测</a></div>',
					    className:'dialog_box',
					    isClose:false
					});
					$('.closeBtn').click(function(){
				    	tipRiskTestDialog.close();
					});
 				} 
 			}
 			else{
 				//提示弹出框
 				var authDialog = $.dialog({
				    dialogDom:'<a class="dialog_close_btn icon-zh-close icon" id="dialog_close_btn"></a><h2 class="dia_title">开通存管账户</h2><p>为满足监管要求，需要为您开通****存管账户，以保障您的资金安全</p><a class="btn">立即开通</a>',
				    className:'msgSetting_dialog_wrapper dia_wrapper',
				    isClose:false
				});
 			}
 			
 		}else{  
 			window.open("/user/login?history=/investment/investmentDescriptionById?id="+$("#targetidHidden").val(),"_blank")
 		} 
 	});
	
	//登录跳转
	$("#btnlogin").bind("click",function(){
		window.open("/user/login?history=/investment/investmentDescriptionById?id="+$("#targetidHidden").val(),"_blank")
	});

	//弹出风险提示书
	$("#riskWarningBook").bind('click',function() { 
  		$("#warnHtml").addClass("show").removeClass('hide');
	});
	$('#btnRead').bind('click',function() {
		$("#warnHtml").addClass("hide").removeClass('show');
	});  

	 //切换tab滑动效果
	switchTabSile(); 

	 //修改页面中的值
	updateHtmlValue();  
});