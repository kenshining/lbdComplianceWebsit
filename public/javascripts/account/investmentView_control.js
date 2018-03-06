var rows=10;
var visiblePages=5; 
var commonUtils=new CommonUtils(); 
var dataDic=new DataDictionary();
//查询条件
var investmentCondition = {
    startTime:'',//开始时间
    endTime:'', //结束时间
    investDate:'', //投资日期 按天数算
    targetState:'', //状态  //已完结5 还款中4 投资中1
};
//我的投资列表页
var getInvestmentListByPage=function(page){ 
    $.lbdAjax({
        url :'/account/investment/findInvestListByPage',
        type:'GET',
        dataType:'JSON',
        data:{ 
           startTime:investmentCondition.startTime,
           endTime:investmentCondition.endTime,
           investDate:investmentCondition.investDate,
           targetState:investmentCondition.targetState, 
           page:page,
           rows:rows,
           _csrf:$("#_csrf").val()
        },
        success:function(msg){
            // console.log(msg) 
            if(msg.state=='SUCCESS'){ 
                var data=msg.data;   
                investmentlistRander(data.content);
                if(data.content.length!=0){
                    $.jqPaginator("#investListPage",{
                        totalPages : data.totalPages,
                        visiblePages: visiblePages,
                        currentPage: (data.number+1),
                        totalnum:data.totalElements,
                        onPageChange: function (num, type) {
                            getInvestmentListByPageChange(num);
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
//我的投资列表分页
var getInvestmentListByPageChange=function(page){
    $.lbdAjax({
        url :'/account/investment/findInvestListByPage',
        type:'GET',
        dataType:'JSON',
        data:{ 
           startTime:investmentCondition.startTime,
           endTime:investmentCondition.endTime,
           investDate:investmentCondition.investDate,
           targetState:investmentCondition.targetState, 
           page:page,
           rows:rows,
           _csrf:$("#_csrf").val()
        },
        success:function(msg){ 
            if(msg.state=='SUCCESS'){
                var data=msg.data;   
                investmentlistRander(data.content); 
            }else{
                layer.msg(JSON.stringify(msg));
            } 
        },
        error:function(msg){  
            layer.msg(JSON.stringify(msg));

        }
    }); 
};
//渲染我的投资列表数据
var investmentlistRander=function(data){ 
    $("#investmentList").html("");
    var html='';
    if(data.length==0){
        html+='<tr class="datanull">';
        html+='<td colspan="9">';
        html+='<div class="contentNullImg"></div>';
        html+='<div class="contentNullText">暂无投资记录</div>';
        html+='</td>';
        html+='</tr>'; 
        $('.lmy_investPage').css('display','none');     
    }else{
        $('.lmy_investPage').css('display','block');     
        // console.log(data);
        for(var i=0;i<data.length;i++){ 
            //借款编号
            var loanNumber=data[i].loanNumber;
            //预期年化收益率
            var nhsyl=(commonUtils.floatMul(data[i].nhsyl,100)).toString();
            //投资时间
            var createdDate=data[i].createdDate;
            //投资金额(元)
            var buyAmt=data[i].buyAmt.toString().formatMoney();
            //计息时间
            var jxDate=data[i].jxDate;
            var endDate=data[i].endDate;
            var rateDate=jxDate+'~'+endDate;
            //当前期数    
            var qs=data[i].qs;
            //总期数 
            var hkqs=data[i].hkqs;
            var periods=qs+'/'+hkqs; 

            //代收本息(元) 本金+利息 
            var bj=data[i].bj-0;
            var lx=data[i].lx-0;
            var paymoney=(bj+lx).toString().formatMoney();  

            //状态  
            var targetState=data[i].targetState==undefined?'':data[i].targetState;
            var statename=dataDic.dicInvestmentTargetState(targetState); 
            
            //跳转到详情的ID  
            var orderId=data[i].orderId;
            //标的ID
            var tid=data[i].targetId;  
            if(targetState==1||targetState==4){
                rateDate='--';
                periods='--';
                paymoney='--';
            } 

            html+='<tr>'; 
            html+='<td><a target="_blank" class="viewLink" href="/investment/investmentDescriptionById?id='+tid+'">'+loanNumber+'</a></td>';
            html+='<td>'+nhsyl+'%</td>';
            html+='<td>'+createdDate+'</td>';
            html+='<td>'+buyAmt+'</td>'; 
            html+='<td>'+rateDate+'</td>';
            html+='<td>'+periods+'</td>';
            html+='<td>'+paymoney+'</td>';
            html+='<td>'+statename+'</td>';
            if(targetState==1||targetState==4){
                html+='<td>--</td>'; 
            }else{
                html+='<td><a onclick="changeCurrentMenu(\'/account/investment/investmentViewDesp?targetId='+tid+'&orderid='+orderId+'\',\'investmentView_sub_m_btn\');" class="viewLink" href="javascript:void(0);">查看</a></td>'; 
            }
            html+='</tr>';   
        }
    }
    $("#investmentList").html(html); 
};

//加载我的投资基本信息
var getinvestmentBase=function(){
    $.lbdAjax({
        url :'/account/investment/getinvestBaseinfo',
        type:'GET',
        dataType:'JSON',
        data:{  
           _csrf:$("#_csrf").val()
        },
        success:function(msg){ 
            if(msg.state=='SUCCESS'){ 
                var data=msg.data;  
                $('#totalInvestment').html(data.totalInvestment.toString().formatMoney());
                $('#receivedBj').html(data.receivedBj.toString().formatMoney());
                $('#receivePrincipal').html(data.receivePrincipal.toString().formatMoney());
                $('#receivedLx').html(data.receivedLx.toString().formatMoney());
                $('#receivedInterest').html(data.receivedInterest.toString().formatMoney());
                //新增使用红包金额
                $('#redAmount').html(data.redAmount.toString().formatMoney())
            }else{
                layer.msg(JSON.stringify(msg));
            } 
        },
        error:function(msg){  
            layer.msg(JSON.stringify(msg)); 
        }
    }); 
};

$(function(){
    //页面加载数据
    getInvestmentListByPage(1);
    getinvestmentBase();
 
 	//按选择查询点击事件
	$('.queryCon ul li.click').bind('click',function(){
		$(this).find('a').addClass('selected').parent().siblings().find('a').removeClass('selected');
        var key=$(this).parent().attr('data-type');
        var value=$(this).find('a').attr('data-value');
        if(key=='investDate'){
            $("#fromDate").val('');
            $("#endDate").val('');
            investmentCondition.startTime=''; 
            investmentCondition.endTime=''; 
        }
        investmentCondition[key]=value;
        getInvestmentListByPage(1); 
	}); 

    //初始化时间控件
    $("#fromDate").datetimepicker({
        language: 'zh-CN',
        pickTime: false,
        todayBtn: true,
        autoclose: true,
        minView: '2',
        forceParse: false, 
        format:"yyyy-mm-dd"
    }); 
    $("#endDate").datetimepicker({
        language: 'zh-CN',
        pickTime: false,
        todayBtn: true,
        autoclose: true,
        minView: '2',
        forceParse: false, 
        format:"yyyy-mm-dd"
    });  
    //日期输入框失去焦点后执行
    $("#fromDate").on("change",function(){ 
        var startTime=$(this).val(); 
        // if(startTime !== "" && !startTime.match(/^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
        //     layer.msg("您输入的查询日期格式不正确。");
        //     return;
        // } 
        if(startTime!==""){
            investmentCondition.startTime=startTime; 
            investmentCondition.investDate='';
            $("#investDate li.click").find('a').removeClass('selected');
            getInvestmentListByPage(1);
        }  
    }); 
    //日期输入框失去焦点后执行
    $("#endDate").on("change",function(){ 
        var endTime=$(this).val(); 
        // if(endTime !== "" && !endTime.match(/^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
        //     layer.msg("您输入的查询日期格式不正确。");
        //     return;
        // } 
        if(endTime!==""){
            investmentCondition.endTime=endTime; 
            investmentCondition.investDate='';
            $("#investDate li.click").find('a').removeClass('selected'); 
            getInvestmentListByPage(1);
        }  
    });  
    
});