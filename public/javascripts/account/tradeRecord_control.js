var commonUtil = new CommonUtils();
var dataDic = new DataDictionary();
//传递参数
var visiblePages = 5;
var fliterObj = {
	page:"1",
	rows:"10",
	type:"",
	state:"",
	days:"",
	beginDate:"",
	endDate:"",
	_csrf:$("#_csrf").val()
};

function initTradeList(){
	$.lbdAjax({
		url:"/account/tradeRecordList",
		dataType:"JSON",
		type:"POST",
		data:fliterObj,
		success:function(e){
			if(e.state === "SUCCESS" && e.data.content &&  e.data.content.length > 0){
				$('.no_data_wrapper').hide();
				$('#tradeRecordPage').show();
				//制作分页，渲染数据
				$.jqPaginator("#tradeRecordPage",{
			        totalPages : e.data.totalPages,
			        visiblePages: visiblePages,
			        currentPage: (e.data.number+1),
			        totalnum:e.data.totalElements,
			        onPageChange: function (num, type) {
			        	fliterObj.page = num;
			        	//点击页码重新渲染页面;
			        	renderTraderList();
			        }
			    });
			}
			if(e.state === "SUCCESS" && e.data.content &&  e.data.content.length == 0){
				$('#tradeList').html('');
				$('#tradeRecordPage').hide();
				$('.no_data_wrapper').show();
			}
			if(e.state === "FAIL"){
				layer.msg(e.message);
			}
		},
		error:function(msg){
			layer.msg(JSON.stringify(msg));
		}
	});
};
function renderTraderList(){
	$.lbdAjax({
		url:"/account/tradeRecordList",
		dataType:"JSON",
		type:"POST",
		data:fliterObj,
		success:function(e){
			if(e.state == "SUCCESS" && e.data.content &&  e.data.content.length > 0){
				//再次渲染页面数据
				var _str = '';
				$.each(e.data.content,function(key,val){
					_str += "<tr><td>"+val.createdDate+"</td><td>"
							+dataDic.dicTradeType(val.type)+"</td><td>"
							+commonUtil.formatMoney(val.payIn)+"</td><td>"
							+commonUtil.formatMoney(val.payOut)+"</td><td>"
							+commonUtil.formatMoney(val.balance || 0)
							+"</td><td>"+dataDic.dicTradeState(val.state)
							+"</td><td>"+val.remark+"</td></tr>"
				});
				$('#tradeList').html(_str);
			}
			if(e.state == "SUCCESS" && e.data.content &&  e.data.content.length == 0){
				$('#tradeList').html('');
				$('#tradeRecordPage').hide();
				$('.no_data_wrapper').show();
			}
			if(e.state == 'FAIL'){
				layer.msg(e.message);
			}
		},
		error:function(msg){
			layer.msg(JSON.stringify(msg));
		}
	});
};
$(document).ready(function(){

	/*日历组件*/
	$("#fromDateParam").datetimepicker({
	    language: 'zh-CN',
	    pickTime: false,
	    todayBtn: true,
	    autoclose: true,
	    minView: '2',
	    forceParse: false, 
	    format:"yyyy-mm-dd"
	}); 
	$("#endDateParam").datetimepicker({
	    language: 'zh-CN',
	    pickTime: false,
	    todayBtn: true,
	    autoclose: true,
	    minView: '2',
	    forceParse: false, 
	    format:"yyyy-mm-dd"
	}); 
	//浮窗
	$('#trade_float').on('mouseover',function(){
		$(this).removeClass('icon-float').addClass('icon-float-h');
		$(this).next().show();
	}).on('mouseout',function(){
		$(this).removeClass('icon-float-h').addClass('icon-float');
		$(this).next().hide();
	});

	//数据格式转换 100000 - 100,000.00
	function _formatMoney(){
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
	}
	_formatMoney();
	
	//从充值/提现页面跳转，查看充值/提现记录
	var tradeRecordType = commonUtil.getUrlParams('tradeRecordType');
	if(tradeRecordType){
		fliterObj.type = tradeRecordType;
		fliterObj.page = "1";
		$('#tradeTypeParams').find('a').removeClass('orange-bg');
		$('#tradeTypeParams').find('a[data-param='+tradeRecordType+']').addClass('orange-bg');
	}

	//初始化页面数据
	initTradeList();
	//交易类型
	$('#tradeTypeParams').on('click','a',function(){
		var type = $(this).attr('data-param');
		fliterObj.type = type;
		fliterObj.page = "1";
		initTradeList();
		$(this).addClass('orange-bg').parent().siblings().find('a').removeClass('orange-bg');
	});
	//交易状态
	$('#tradeStateParams').on('click','a',function(){
		var state = $(this).attr('data-param');
		fliterObj.state = state;
		fliterObj.page = "1";
		initTradeList();
		$(this).addClass('orange-bg').parent().siblings().find('a').removeClass('orange-bg');
	});

	//交易日期
	//字段缺失
	$('#tradeDateParams').on('click','a',function(){
		var days = $(this).attr('data-param');

		$('#fromDateParam').val("");
		$('#endDateParam').val("");

		fliterObj.beginDate = '';
		fliterObj.endDate = '';
		fliterObj.days = days;
		fliterObj.page = "1";
		initTradeList();
		$(this).addClass('orange-bg').parent().siblings().find('a').removeClass('orange-bg');
	});
	//开始日期
	$('#fromDateParam').on('change',function(){
		var beginDate = $(this).val();
		$('#tradeDateParams').find('a').removeClass('orange-bg');
		fliterObj.days = '';
		fliterObj.beginDate = beginDate;
		fliterObj.page = "1";
		initTradeList();
	});
	//结束日期
	$('#endDateParam').on('change',function(){
		var endDate = $(this).val();
		$('#tradeDateParams').find('a').removeClass('orange-bg');
		fliterObj.endDate = endDate;
		fliterObj.days = '';
		fliterObj.page = "1";
		initTradeList();
	});

	$('input[type=text]').on('focus',function(){
		$(this).addClass('onfocus');
	}).on('blur',function(){
		$(this).removeClass('onfocus');
	});

});