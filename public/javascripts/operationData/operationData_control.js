var commonUtil = new CommonUtils();
$(document).ready(function() {
	//头部导航的高亮样式
	$('#header_nav').find('li').removeClass('select').end().find('#nav_header_operationData_sub').addClass('select');
	/*去掉底部的固定定位*/
	$('.footer_bar').css('position','static');

	//数据格式
	$('.formatMoney').each(function(){
		var val = $(this).html();
		if(val.indexOf('￥') != -1){
			var _val = commonUtil.formatMoney(val.replace(/￥/g,''));
			$(this).html('￥'+_val);
		}else{
			var _val = commonUtil.formatMoney(val);
			$(this).html(_val);
		};
	});

	//满标时长
	var operationDataInvestTracksTime = commonUtil.formatSeconds($("#operationDataInvestTracks").attr('data-time'));
	$('#operationDataInvestTracks .operationDataInvestTracks_h').data('to',operationDataInvestTracksTime.timeH);
	$('#operationDataInvestTracks .operationDataInvestTracks_m').data('to',operationDataInvestTracksTime.timeM);
	$('#operationDataInvestTracks .operationDataInvestTracks_s').data('to',operationDataInvestTracksTime.timeS);

	//数字滚动增加
	$(document).scroll(function(){

		var scrollTop = $(this).scrollTop();
		var windowH = $(window).height();

		$('.count-timer').each(function(){

			var eleTop = $(this).offset().top;
			var to = $(this).data('to');
			var countToInit = $(this).data('counttoinit');
			var countToFormatMoney = $(this).hasClass('formatMoney');
			if((scrollTop+windowH)>eleTop && countToInit<1){
				$(this).countTo({
					to:to,
					formatMoney:countToFormatMoney
				});
			}
		});  	
	});

	//投资统计图
	var myInvestChart = echarts.init(document.getElementById('myInvestChart'))
	var myInvestChart_datas = JSON.parse($('#_INVESTGRAPH').val());

	var myInvestChart_Y = [];
	for(var i in myInvestChart_datas){
		if(myInvestChart_datas[i].amt != ""){
			myInvestChart_Y.push(myInvestChart_datas[i].amt/10000);
		}else{
			myInvestChart_Y.push(myInvestChart_datas[i].amt);
		}
	};
	var myInvestChart_X = [];
	for(var i in myInvestChart_datas){
		myInvestChart_X.push(myInvestChart_datas[i].date);
	};

	var myInvestChart_option = {
	    title: {
	        text:"投资本金（万元）",
	        left:"-5px",
	        textStyle:{
	        	fontSize:"14px",
	        	color:"#6e96cf"
	        }
	    },
	    series: [
	        {
	            name:'投资本金',
	            type:'line',
	            stack: '',
	            data:myInvestChart_Y
	        }
	    ],
	    tooltip: {
	        trigger: 'axis',
	       	formatter: function(params){
	       		var idx = params[0].dataIndex;
	       		var res = '<div style="position:absolute;left:50%;top:0;padding:7px 10px;border-radius:4px;background:#fca948;box-shadow:0 0 2px 1px rgba(0,0,0,0.1);text-align:center;font-size:14px;transform:translatex(-50%);-moz-transform:translatex(-50%);">投资本金(万元)： ￥'+(myInvestChart_datas[idx].amt/10000)+'</br>投资笔数： '+myInvestChart_datas[idx].count+'笔<em class="arrow_bot"></em></div>';
	       		if(myInvestChart_datas[idx].amt == "" && myInvestChart_datas[idx].count == ""){
	       			return;
	       		}else{
	       			return res ;
	       		}
	       	},
	       	axisPointer:{
	       		type:'none'
	       	},
	       	position:function(p){
	       		return [p[0]-3,p[1]-80];
	       	}
	    },
	    grid: {
	        left: '0',
	        right: '9%',
	        top:'9%',
	        containLabel: true
	    },
	    toolbox: {
	        feature: {
	            saveAsImage: {show:false}
	        }
	    },
	    xAxis: {
	        type: 'category',
	        boundaryGap: false,
	        data: myInvestChart_X,
	        splitLine:{
	        	show:true,
	        	lineStyle:{
	        		color:"#0a2c5e"
	        	}
	        },
	        axisLine:{
	        	lineStyle:{
	        		color:"#123e7f"
	        	}
	        },
	        axisLabel:{
	        	textStyle:{
	        		color:'#dceaff'
	        	},
	        	margin:20
	        }
	    },
	    yAxis: {
	        type: 'value',
	        splitLine:{
	        	show:true,
	        	lineStyle:{
	        		color:"#0a2c5e"
	        	}
	        },
	        axisLine:{
	        	lineStyle:{
	        		color:"#123e7f"
	        	}
	        },
	        axisLabel:{
	        	textStyle:{
	        		color:'#dceaff'
	        	},
	        	margin:20
	        }
	    },
	    color:['#fca948'],
	    graphic:{
	    	elements:[
	    		{
	    			cursor:"pointer"
	    		}
	    	]
	    }
	};

 	myInvestChart.setOption(myInvestChart_option);


 	//借款统计图
	var myLoanChart = echarts.init(document.getElementById('myLoanChart'))
	var myLoanChart_datas = JSON.parse($('#_LOANGRAPH').val());

	var myLoanChart_Y = [];
	for(var i in myLoanChart_datas){
		if(myLoanChart_datas[i].amt != ""){
			myLoanChart_Y.push(myLoanChart_datas[i].amt/10000);
		}else{
			myLoanChart_Y.push(myLoanChart_datas[i].amt);
		};
	};

	var myLoanChart_X = [];
	for(var i in myLoanChart_datas){
		myLoanChart_X.push(myLoanChart_datas[i].date);
	};
	var myLoanChart_option = {
	    title: {
	        text:"借款本金（万元）",
	        left:"-5px",
	        textStyle:{
	        	fontSize:"14px",
	        	color:"#6e96cf"
	        }
	    },
	    series: [
	        {
	            name:'借款本金',
	            type:'line',
	            stack: '',
	            data:myLoanChart_Y
	        }
	    ],
	    tooltip: {
	        trigger: 'axis',
	       	formatter: function(params){
	       		var idx = params[0].dataIndex;
	       		var res = '<div style="position:absolute;left:50%;top:0;padding:7px 10px;border-radius:4px;background:#fca948;box-shadow:0 0 2px 1px rgba(0,0,0,0.1);text-align:center;font-size:14px;transform:translatex(-50%);-moz-transform:translatex(-50%);">借款本金(万元)： ￥'+(myLoanChart_datas[idx].amt/10000)+'</br>借款笔数： '+myLoanChart_datas[idx].count+'笔<em class="arrow_bot"></em></div>';
	       		if(myLoanChart_datas[idx].amt == "" && myLoanChart_datas[idx].count == ""){
	       			return;
	       		}else{
	       			return res ;
	       		}
	       	},
	       	axisPointer:{
	       		type:'none'
	       	},
	       	position:function(p){
	       		return [p[0]-3,p[1]-80];
	       	}
	    },
	    toolbox:{
	    	feature:{

	    	}
	    },
	    grid: {
	        left: '0',
	        right: '9%',
	        top:'9%',
	        containLabel: true
	    },
	    toolbox: {
	        feature: {
	            saveAsImage: {show:false}
	        }
	    },
	    xAxis: {
	        type: 'category',
	        boundaryGap: false,
	        data: myLoanChart_X,
	        splitLine:{
	        	show:true,
	        	lineStyle:{
	        		color:"#0a2c5e"
	        	}
	        },
	        axisLine:{
	        	lineStyle:{
	        		color:"#123e7f"
	        	}
	        },
	        axisLabel:{
	        	textStyle:{
	        		color:'#dceaff'
	        	},
	        	margin:20
	        }
	    },
	    yAxis: {
	        type: 'value',
	        splitLine:{
	        	show:true,
	        	lineStyle:{
	        		color:"#0a2c5e"
	        	}
	        },
	        axisLine:{
	        	lineStyle:{
	        		color:"#123e7f"
	        	}
	        },
	        axisLabel:{
	        	textStyle:{
	        		color:'#dceaff'
	        	},
	        	margin:20
	        }
	    },
	    color:['#fca948','#fca948'],
	    graphic:{
	    	elements:[
	    		{
	    			cursor:"pointer"
	    		}
	    	]
	    }
	};

 	myLoanChart.setOption(myLoanChart_option);
});