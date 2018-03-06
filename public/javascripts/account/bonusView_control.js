var rows=9;
var visiblePages=5; 
var dataDic=new DataDictionary();
var commonUtils=new CommonUtils();
//查询条件
var bonusFindCondition = {
    state:'',//优惠卷状态
    type:'1', //奖励类型 
};
//获取我的特权列表
var getBonusList=function(page){  
    $.lbdAjax({
        url :'/account/bonus/findBonusListByPage',
        type:'GET',
        dataType:'JSON',
        data:{
           type:bonusFindCondition.type,
           state:bonusFindCondition.state,
           page:page,
           rows:rows,
           _csrf:$("#_csrf").val()
        },
        success:function(msg){ 
            if(msg.state=='SUCCESS'){  
                var data=msg.data;  
                console.log(data);
                bonusRander(data.content);  
                if(data.content.length!=0){
                    $.jqPaginator("#bonusPage",{
                        totalPages : data.totalPages,
                        visiblePages: visiblePages,
                        currentPage: (data.number+1),
                        totalnum:data.totalElements,
                        onPageChange: function (num, type) {
                            getBonusListChange(num);
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
//获取我的特权列表分页
var getBonusListChange=function(page){
	$.lbdAjax({
        url :'/account/bonus/findBonusListByPage',
        type:'GET',
        dataType:'JSON',
        data:{
           type:bonusFindCondition.type,
           state:bonusFindCondition.state,
           page:page,
           rows:rows,
           amount:"",
           _csrf:$("#_csrf").val()
        },
        success:function(msg){ 
            if(msg.state=='SUCCESS'){ 
                var data=msg.data; 
                bonusRander(data.content);   
            }else{
                layer.msg(JSON.stringify(msg));
            } 
        },
        error:function(msg){  
            layer.msg(JSON.stringify(msg)); 
        }
    });
};
//渲染我的特权列表
var bonusRander=function(data){
	$("#bonuslist").html("");
    var html='';
    console.log(data);
    if(data.length==0){ 
    	html+='<div class="bonusNull">';
    	html+='<img src="/dist/images/account/bonusNull.png">';
    	html+='<div class="bonusNullText">暂无奖励</div>';
    	html+='</div>';  
        $('.lmy_investPage').css('display','none');     
    }else{
    	html+='<ul>';
    	for(var i=0;i<data.length;i++){  
			var state=data[i].state.toString();
			if(state=='1'){
				html+='<li class="left noUse">';
			}else if(state=='2'){
				html+='<li class="left used">';
			}else if(state=='3'){
				html+='<li class="left pass">';
			} 
            var type=data[i].type.toString();
			var typename=dataDic.dicRewardType(type)[1];
			var typeunit=dataDic.dicRewardType(type)[2];  
            // console.log(data[i].value);
			var value=commonUtils.floatMul((data[i].value-0),(dataDic.dicRewardType(type)[3]));

			var useCondition=data[i].amount;
            var targetType=data[i].target_type;
			var useProduct=dataDic.dicUseProduct(targetType);
            var bonusType=data[i].subtype;
            var bonusTypeName=dataDic.dicBonusOrigin(bonusType);
			var useDateRange=data[i].begin_time.split(' ')[0]+'~'+data[i].end_time.split(' ')[0];
	    	html+='<div class="bonusText">';
	    	html+='<div class="bonusleft left">';
	    	html+='<p class="value"><span>'+value+'</span><span class="smallfont">'+typeunit+'</span></p>';
	    	html+='<p class="valueName">'+typename+'</p>';
	    	html+='<p class="moneyText dateText">有效日期：</p>';
	    	html+='</div>';
	    	html+='<div class="bonusright left">';
	    	html+='<p class="moneyText mgtop">使用条件：</p>';
	    	html+='<p class="moneyValue conditionMgtop">投资≥'+useCondition+'</p>';
	    	html+='<p class="moneyText conditionMgtop">适用产品：</p>';
	    	html+='<p class="moneyValue conditionMgtop">'+useProduct+'</p>';
	    	html+='<p class="moneyText conditionMgtop">奖励来源：</p>';
	    	html+='<p class="moneyValue conditionMgtop">'+bonusTypeName+'</p>';
	    	html+='<p class="date">'+useDateRange+'</p>';
	    	html+='</div>';
	    	html+='</div>';
	    	html+='</li>';
    	} 
    	html+='</ul>';
    	$('.lmy_investPage').css('display','block'); 
    }
    $("#bonuslist").html(html);
};
$(function(){ 
	//页面加载获取数据
	getBonusList(1);

    //按选择查询点击事件
	$('.queryCon ul li').bind('click',function(){
		$(this).find('a').addClass('selected').parent().siblings().find('a').removeClass('selected');
		var state=$(this).find('a').attr('data-state');
		bonusFindCondition.state=state;
		getBonusList(1);
	}); 

	//优惠卷滑动
	$('.bonustype ul li').bind('click',function(){
		$(this).addClass('selected').siblings().removeClass('selected'); 
		$('.slideBorder').animate({'left':$(this).position().left});
		var type=$(this).attr('data-type');
		bonusFindCondition.type=type;
		getBonusList(1); 
	});

});