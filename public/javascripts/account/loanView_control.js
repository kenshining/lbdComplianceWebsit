var rows=10;
var visiblePages=5; 
var commonUtils=new CommonUtils(); 
var dataDic=new DataDictionary(); 
//查询条件
var loanCondition = {
    startTime:'',//开始时间
    endTime:'', //结束时间
    repayDate:'', //投资日期 按天数算
    targetState:'', //状态  //已完结5 还款中4 投资中1
};
//我的借款列表页
var getLoanListByPage=function(page){ 
    $.lbdAjax({
        url :'/account/loan/loanlist',
        type:'GET',
        dataType:'JSON',
        data:{ 
           startTime:loanCondition.startTime,
           endTime:loanCondition.endTime,
           investDate:loanCondition.repayDate,
           targetState:loanCondition.targetState, 
           page:page,
           rows:rows,
           _csrf:$("#_csrf").val()
        },
        success:function(msg){  
            if(msg.state=='SUCCESS'){ 
                var data=msg.data;   
                loanListRander(data.content);
                if(data.content.length!=0){
                    $.jqPaginator("#investListPage",{
                        totalPages : data.totalPages,
                        visiblePages: visiblePages,
                        currentPage: (data.number+1),
                        totalnum:data.totalElements,
                        onPageChange: function (num, type) {
                            getLoanListByPageChange(num);
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
//我的借款列表分页
var getLoanListByPageChange=function(page){ 
    $.lbdAjax({
        url :'/account/loan/loanlist',
        type:'GET',
        dataType:'JSON',
        data:{ 
           startTime:loanCondition.startTime,
           endTime:loanCondition.endTime,
           investDate:loanCondition.repayDate,
           targetState:loanCondition.targetState,
           page:page,
           rows:rows,
           _csrf:$("#_csrf").val()
        },
        success:function(msg){ 
            if(msg.state=='SUCCESS'){ 
                var data=msg.data;  
                loanListRander(data.content); 
            }else{
                layer.msg(JSON.stringify(msg));
            } 
        },
        error:function(msg){  
            layer.msg(JSON.stringify(msg));

        }
    }); 
};
//渲染
var loanListRander=function(data){
    $("#loanList").html("");
    var html=''; 
    if(data.length==0){
        html+='<tr class="datanull">';
        html+='<td colspan="9">';
        html+='<div class="contentNullImg"></div>';
        html+='<div class="contentNullText">暂无借款记录</div>';
        html+='</td>';
        html+='</tr>'; 
        $('.lmy_investPage').css('display','none');     
    }else{
        $('.lmy_investPage').css('display','block');  
        for(var i=0;i<data.length;i++){  
            var loanNumber=data[i].loanNumber;
            var htje=data[i].htje.toString().formatMoney();
            var nhsyl=(commonUtils.floatMul(data[i].nhsyl,100)).toString()+'%';
            var qs_view=data[i].qs+'/'+data[i].hkqs;
            var loanDate=data[i].lendingDay+'~'+data[i].completionTime;
            // 本金+利息  
            var bx=(commonUtils.floatAdd((data[i].bj-0),(data[i].lx-0))).toString().formatMoney();
            var targetState=data[i].targetState.toString();
            var targetStateName=dataDic.dicLoanTargetState(targetState); 
            var id=data[i].id;
            if(targetState=='1'||targetState=='4'){
                qs_view='--';
                loanDate='--';
                bx='--';
            }

            html+='<tr>';
            html+='<td><a class="viewLink" target="_blank" href="/investment/investmentDescriptionById?id='+id+'">'+loanNumber+'</a></td>';
            html+='<td>'+htje+'</td>';
            html+='<td>'+nhsyl+'</td>';
            html+='<td>'+qs_view+'</td>';
            html+='<td>'+loanDate+'</td>';
            html+='<td>'+bx+'</td>';
            html+='<td>'+targetStateName+'</td>';
            if(targetState=='1'||targetState=='4'){
                html+='<td>--</td>';
            }else if(targetState=='3'){
                html+='<td><a onclick="changeCurrentMenu(\'/account/loan/loanViewDesp?targetid='+id+'\',\'loanView_sub_m_btn\');" class="viewLink" href="javascript:void(0);">查看</a></td>'; 
            }else{
                html+='<td><a onclick="changeCurrentMenu(\'/account/loan/loanViewDesp?targetid='+id+'\',\'loanView_sub_m_btn\');" class="viewLink" href="javascript:void(0);">还款</a></td>'; 
            } 
            html+='</tr>';
        }
    }
    $("#loanList").html(html); 
};
//获取我的借款总览
var getLoanListBaseinfo=function(){
    $.lbdAjax({
        url :'/account/loan/loanBaseinfo',
        type:'GET',
        dataType:'JSON',
        data:{  
           _csrf:$("#_csrf").val()
        },
        success:function(msg){ 
            if(msg.state=='SUCCESS'){ 
                var data=msg.data; 
                // console.log(data.totalBorrowing.toString());
                // console.log(data.totalBorrowing.toString().formatMoney());
                $('#totalBorrowing').html(data.totalBorrowing.toString().formatMoney());
                $('#totalPayout').html(data.totalPayout.toString().formatMoney());
                $('#dhBj').html(data.dhBj.toString().formatMoney());
                $('#yhBj').html(data.yhBj.toString().formatMoney());
                $('#dhLx').html(data.dhLx.toString().formatMoney());
                $('#yhLx').html(data.yhLx.toString().formatMoney()); 
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
    //加载数据
    getLoanListByPage(1);
    getLoanListBaseinfo();
	//按选择查询点击事件
    $('.queryCon ul li.click').bind('click',function(){
        $(this).find('a').addClass('selected').parent().siblings().find('a').removeClass('selected');
        var key=$(this).parent().attr('data-type');
        var value=$(this).find('a').attr('data-value');
        if(key=='repayDate'){
            $("#fromDate").val('');
            $("#endDate").val('');
            loanCondition.startTime=''; 
            loanCondition.endTime=''; 
        }
        loanCondition[key]=value; 
        getLoanListByPage(1); 
    }); 

 
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
        if(startTime!==""){
            loanCondition.startTime=startTime;
            loanCondition.repayDate=''; 
            $("#repayDate li.click").find('a').removeClass('selected');
            getLoanListByPage(1); 
        }  
    }); 
    //日期输入框失去焦点后执行
    $("#endDate").on("change",function(){ 
        var endTime=$(this).val();  
        if(endTime!==""){
            loanCondition.endTime=endTime;
            loanCondition.repayDate='';  
            $("#repayDate li.click").find('a').removeClass('selected'); 
            getLoanListByPage(1);
        }  
    }); 

});