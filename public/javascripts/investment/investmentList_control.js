var commonUtils=new CommonUtils();
//查询条件 desc倒序 asc正序
var investmentCondition = {
	swDklx:'',//类型e
	swFkqx:'', //期限
	rate:'', //利率
	targetState:'', //状态
	sort:'target_state asc,audit_time desc', 
};
var rows=5;
//加载投资列表
var loadInvestmentList = function(page){  
	$.lbdAjax({
		url	:'/investment/findInvestListByPage',
		type:'GET',
		dataType:'JSON',
		data:{
			page:page,
			rows:rows,
			sort:investmentCondition.sort,
			swDklx:investmentCondition.swDklx,
			swFkqx:investmentCondition.swFkqx,
			rate:investmentCondition.rate,
			targetState:investmentCondition.targetState,
			_csrf:$("#_csrf").val()
		},
		success:function(msg){ 
			console.log(msg);
			if(msg.state=='SUCCESS'){ 
				var data=msg.data; 
				$('#totalLoanNum').html(data.totalElements);
				recordInvestmentRander(data.content); 
				if(data.content.length!=0){ 
					$('.invest_pagination').show(); 
					$.jqPaginator("#investment_list_pager",{
				        totalPages : data.totalPages,
				        visiblePages: 5,
				        currentPage: (data.number+1),
				        totalnum:data.totalElements,
				        onPageChange: function (num, type) { 
							loadInvestmentListByPageChange(num);
				        }
				    });
				}else{
					$('.invest_pagination').hide();
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

//点击分页获取投资列表
var loadInvestmentListByPageChange=function(page){ 
	$.lbdAjax({
		url	:'/investment/findInvestListByPage',
		type:'GET',
		dataType:'JSON',
		data:{
			page:page,
			rows:rows,
			sort:investmentCondition.sort,
			swDklx:investmentCondition.swDklx,
			swFkqx:investmentCondition.swFkqx,
			rate:investmentCondition.rate,
			targetState:investmentCondition.targetState, 
			_csrf:$("#_csrf").val()
		},
		success:function(msg){ 
			if(msg.state=='SUCCESS'){
				var data=msg.data; 
				recordInvestmentRander(data.content);  
			}else{
				// msg.message;
			} 
		},
		error:function(msg){

		}
	});
};

//渲染列表显示
var recordInvestmentRander = function(record){ 
	var html='';
	$('#invest_prolist').html(html); 
	if(record.length==0){
		html+='<div style="text-align:center;padding-bottom:150px;">'; 
		html+='<img style="margin-top: 108px;" src="../images/ltip.png">';
		html+='<div style="color:#7285a0;font-size:14px;margin-top:8px;">很遗憾，没有查到满足条件的标的信息</div>'; 
		html+='<div>'; 
		$('#invest_prolist').html(html); 
	}
	else{
		for(var i=0;i<record.length;i++){ 
			//贷款类型 
			var swDklxID=record[i].productid==undefined?0:record[i].productid;
			var swDklx="";
			if(swDklxID=='103'){
				swDklx="车辆周转贷";
			}
			if(swDklxID=='104'){
				swDklx="房产周转贷";
			}
			if(swDklxID=='105'){
				swDklx="个人消费贷";
			}
			if(swDklxID=='106'){
				swDklx="个体经营贷";
			}
			if(swDklxID=='107'){
				swDklx="农业贷";
			}
			if(swDklxID=='108'){
				swDklx="企业经营贷";
			}  
			//奖励类型 1特权本金2加息劵3现金劵
			var bonusType=record[i].bonusType;
			//预期年化收益率     
		  	var rate=record[i].nhsyl==undefined?0:(commonUtils.floatMul(record[i].nhsyl,100)).toString();   
		  	var addRate=record[i].addRate==undefined?0:record[i].addRate.toString(); 
		  	var firstRate=0;
		  	var decimalRate=0;
		  	var secondRate=0;   
		  	if(rate==0){
		  		firstRate=0;
		  		secondRate=0;
		  	}else{  
		  		firstRate=rate.split('.')[0];  
				decimalRate=rate.split('.')[1]==undefined?'':'.'+rate.split('.')[1]; 
				if(addRate==0){
					secondRate=decimalRate+'<span class="percent">%</span>';
				}else{
					secondRate=decimalRate+'+'+addRate+'<span class="percent">%</span>';	
				} 
		  	} 

			//投资期限
			var swFkqx=record[i].htqx==null?0:record[i].htqx;
			//起投金额
			var startAmount=record[i].startAmount==null?0:record[i].startAmount;
			//借款金额
			var swFkje=record[i].htje==null?0:record[i].htje;
			//投资人数
			var totlePerson=record[i].totlePerson==null?0:record[i].totlePerson;
			//已投资
			var castAmount=record[i].investAmount==null?0:record[i].investAmount;
			//投资进度
			// var investProcess=record[i].investProcess==null?0:record[i].investProcess;
			var investProcess=Math.floor(castAmount/swFkje*100); 
			if(investProcess>100){
				investProcess=100;
			} 
			//投资状态 标的状态:1立即投资 2即将开放 3已满标 4还款中 5已完结
			var targetState=record[i].targetState==null?0:record[i].targetState;
			//体验金标 1是 2 否
			var experienceTarget=record[i].experienceTarget==null?2:record[i].experienceTarget;
			//项目ID
			var targetid=record[i].targetId==''||record[i].targetId==undefined?0:record[i].targetId;
			 
			var value=i%2; 
			if(value===0){
				html+='<div data-id='+targetid+' class="invest_pro_bar">'
			}else{
				html+='<div data-id='+targetid+' class="invest_pro_bar invest_pro_bar_even">'
			}
			html+='<div class="invest_proname clearfix">'; 
			html+='<div class="proname">'+swDklx+'</div>';
	  
			if(bonusType){ 
				var bonusTypeArr=bonusType.split(',');
				for(var j=0;j<bonusTypeArr.length;j++){  
					if(bonusTypeArr[j]==1){
						html+='<div class="pronametip">';
						html+='<a href="#" class="pronametext orange">特权本金</a>';
						html+='<div class="pronametip_hover hide">';
						html+='<div class="arrow_border"></div>';
						html+='<div class="arrow_border_trans"></div>';
						html+='<div class="arrow_text">可使用特权本金</div>';
						html+='</div>';
						html+='</div>';
					}else if(bonusTypeArr[j]==2){
						html+='<div class="pronametip">';
						html+='<a href="#" class="pronametext orange">加息劵</a>';
						html+='<div class="pronametip_hover hide">';
						html+='<div class="arrow_border"></div>';
						html+='<div class="arrow_border_trans"></div>';
						html+='<div class="arrow_text">可使用加息劵</div>';
						html+='</div>';
						html+='</div>';
					}else if(bonusTypeArr[j]==3){
						html+='<div class="pronametip">';
						html+='<a href="#" class="pronametext orange">现金劵</a>';
						html+='<div class="pronametip_hover hide">';
						html+='<div class="arrow_border"></div>';
						html+='<div class="arrow_border_trans"></div>';
						html+='<div class="arrow_text">现金劵</div>';
						html+='</div>';
						html+='</div>';
					}else{

					}

				} 
			}  
			html+='</div>';

			html+='<div class="invest_pro_instro">';
			html+='<div class="investValue">';
			html+='<span class="invest_yield_rate">';
			html+='<p class="topline orange"><span class="firstValue">'+firstRate+'</span><span>'+secondRate+'</span></p>';
			 
			html+='</span>';
			html+='<span class="invest_deadline">';
			html+='<p class="invest_text_top"><span>'+swFkqx+'</span>个月</p>'; 
			html+='</span>';
			html+='<span class="invest_start_money">';
			html+='<p class="invest_text_top"><span>￥</span><span>'+startAmount.toString().formatMoney()+'</span></p>';
		 
			html+='</span>';
			html+='<span class="invest_borrow">';
			html+='<p class="invest_text_top"><span>￥</span><span>'+swFkje.toString().formatMoney()+'</span></p>';
			 
			html+='</span>';
			html+='<span class="invest_data_value">';
			html+='<p class="pro_bar bg_gray"><span class="bg_blue" style="width:'+investProcess+'%;"></span></p>';
			html+='</span>'; 
			html+='</div>';

			html+='<div class="investText">'; 
			html+='<span class="invest_yield_rate">';
			html+='<p class="invest_text">预期年化收益率</p>';
			html+='</span>';
			html+='<span class="invest_deadline">';
			html+='<p class="invest_text">投资期限</p>';
			html+='</span>';
			html+='<span class="invest_start_money">';
			html+='<p class="invest_text">起投金额</p>';
			html+='</span>';
			html+='<span class="invest_borrow">';
			html+='<p class="invest_text">借款金额</p>';
			html+='</span>';
			html+='<span class="invest_data_value">';
			html+='<p class="invest_text_center">';
			html+='<span class="wleft">'+totlePerson+'</span>';
			html+='<span class="wcenter"><span>￥</span>'+castAmount.toString().formatMoney()+'</span>';
			html+='<span class="wright">'+investProcess+'%</span>';
			html+='</p>';
			html+='<p class="invest_text">';
			html+='<span class="wleft">投资人数</span>';
			html+='<span class="wcenter">已投资</span>';
			html+='<span class="wright">投资进度</span>';
			html+='</p>';
			html+='</span>'; 
			html+='</div>';


			html+='<div class="invest_btn">'; 
			//1立即投资 2即将开放 3已满标 4还款中 5已完结 6流标显示已完结的情况
			if(targetState==1){
				html+='<a href="#" class="btninvest btnhover">立即投资</a>';
			}else if(targetState==2){
				html+='<a href="#" class="btninvest btninvest_disabled">即将开放</a>';
			}else if(targetState==3){
				html+='<a href="#" class="iconstate icon-lfullmark"></a>'; 
			}else if(targetState==4){
				html+='<a href="#" class="iconstate icon-lpaying"></a>'; 
			}else if(targetState==5){
				html+='<a href="#" class="iconstate icon-lover"></a>'; 
			}else if(targetState==6){
				html+='<a href="#" class="iconstate icon-lover"></a>'; 
			} 
			html+='</div>'; 
			html+='</div>';
			if(experienceTarget===1){
				html+='<div class="invest_flag">';
				html+='<span class="icon icon-lflag"></span>';
				html+='</div>';
			}
			html+='</div>';  
		}
		$('#invest_prolist').html(html);
	}
	//给中间部分加最小高度
	setPageMinHeight();
};

//设置页面最小高
var setPageMinHeight=function(){ 
	var pageH = $('.invest_pro').height()+ $('.invest_filter').height()+330; 
	$('.invest_main').css('min-height',pageH+'px');	
};
$(document).ready(function(){

	//变更主菜单样式   
	$('#header_nav').find('li').removeClass('select').end().find('#nav_header_investmentList_sub').addClass('select');

	//加载投资列表 
	loadInvestmentList(1);

	//为多选菜单添加事件
	$('.filter li').on('click',function(){
		$(this).addClass('select').siblings().removeClass('select');
		var value=$(this).attr('data-id');
		var key=$(this).parent().attr('data-id');
		investmentCondition[key]=value; 
		loadInvestmentList(1); 
	}); 
	//为奖励类型添加提示
	$('#invest_prolist').on('mouseover','.pronametip',function(){ 
		$(this).find('.pronametip_hover').addClass('show');
		$(this).siblings().find('.pronametip_hover').removeClass('show');
	});
	$('#invest_prolist').on('mouseout','.pronametip',function(){
		$(this).find('.pronametip_hover').addClass('hide').removeClass('show'); 
		$(this).siblings().find('.pronametip_hover').addClass('hide').removeClass('show'); 
	});

	//为排序菜单添加事件
	var clickflag=true;
	var sorttype='desc';
	$(".invest_sort_ul li").on('click',function(){ 
		$(this).addClass('select').siblings().removeClass('select');
		$(this).siblings().find('em').addClass('icon-larrowgray').removeClass('icon-larrowlight'); 

		if(clickflag){
			$(this).find('em.iconsortup').addClass('icon-larrowgray').removeClass('icon-larrowlight');
			$(this).find('em.iconsortdown').addClass('icon-larrowlight').removeClass('icon-larrowgray');
			clickflag=false;
			sorttype='desc';
		}else{
			$(this).find('em.iconsortup').addClass('icon-larrowlight').removeClass('icon-larrowgray');
			$(this).find('em.iconsortdown').addClass('icon-larrowgray').removeClass('icon-larrowlight');
			clickflag=true;
			sorttype='asc'; 
		} 
		investmentCondition['sort']=$(this).attr('data-id')+' '+sorttype;  
		loadInvestmentList(1);
	});

	//点击项目列表跳转
	$('#invest_prolist').on('click','.invest_pro_bar',function(){
		var id=$(this).attr('data-id');
	 	window.open("/investment/investmentDescriptionById?id="+id,"_blank") 
	 	// location.href='/investment/investmentDescriptionById';
	})
 

});