var rows=10;
var visiblePages=5;  
//精确计算金钱的格式化
var commonUtils=new CommonUtils(); 
var dataDic=new DataDictionary();
//立即还款基本信息
var PayInfo={
    bj:'',
    lx:'',
    yqts:'',
    whfx:'',
    yqlv:'',
    total:''
};
//借款详情总览
var loanViewDespBaseinfo=function(targetId){
    $.lbdAjax({
        url :'/account/loan/loanDespBaseinfo',
        type:'GET',
        dataType:'JSON',
        data:{  
           _csrf:$("#_csrf").val(),
           targetId:targetId
        },
        success:function(msg){  
            if(msg.state=='SUCCESS'){ 
                var data=msg.data; 
                $('#receiveBX').html(data.receiveBX.toString().formatMoney());
                $('#receivePrincipal').html(data.receivePrincipal.toString().formatMoney());
                $('#receivedInterest').html(data.receivedInterest.toString().formatMoney());
                $('#loanNumber').html(data.loanNumber);
                $('#nhsyl').html((commonUtils.floatMul(data.nhsyl,100)).toString()+'%');
                $('#htqx').html(data.htqx); 
                $('#productid').html(dataDic.dicProductid(data.productid)); 
                $('#hkfs').html(dataDic.dicRepaymentMethod(data.hkfs));
                $('#dateRange').html(data.lendingDay+'~'+data.completionTime);

            }else{
                layer.msg(JSON.stringify(msg));
            } 
        },
        error:function(msg){  
            layer.msg(JSON.stringify(msg)); 
        }
    }); 
};
//借款详情列表
var getLoanDespList=function(page,targetId){ 
    $.lbdAjax({
        url:'/account/loan/loanDespList',
        type:'GET',
        dataType:'JSON',
        data:{ 
           targetId:targetId,
           page:page,
           rows:rows,
           _csrf:$("#_csrf").val()
        },
        success:function(msg){  
            // console.log(msg);
            if(msg.state=='SUCCESS'){ 
                var data=msg.data;   
                loanDespListRander(data.content);
                if(data.content.length!=0){
                    $.jqPaginator("#investDespPage",{
                        totalPages : data.totalPages,
                        visiblePages: visiblePages,
                        currentPage: (data.number+1),
                        totalnum:data.totalElements,
                        onPageChange: function (num, type) {
                            getLoanDespListChange(num,targetId);
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
//借款详情列表分页
var getLoanDespListChange=function(page,targetId){
    $.lbdAjax({
        url :'/account/loan/loanDespList',
        type:'GET',
        dataType:'JSON',
        data:{ 
           targetId:targetId,
           page:page,
           rows:rows,
           _csrf:$("#_csrf").val()
        },
        success:function(msg){  
            if(msg.state=='SUCCESS'){ 
                var data=msg.data;   
                loanDespListRander(data.content); 
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
var loanDespListRander=function(data){ 
    $('#loadDespList').html('');
    var html=''; 
    if(data.length==0){
        html+='<tr class="datanull">';
        html+='<td colspan="9">';
        html+='<div class="contentNullImg"></div>';
        html+='<div class="contentNullText">暂无记录</div>';
        html+='</td>';
        html+='</tr>'; 
        $('.lmy_investPage').css('display','none');     
    }else{
        $('.lmy_investPage').css('display','block');  
        for(var i=0;i<data.length;i++){ 
            //期数 
            var qs=data[i].qs;
            //本期还款日 
            var yhkr=data[i].yhkr.split(' ')[0]; 
            //应收本息(元)
            var bx=(commonUtils.floatAdd((data[i].bj-0),(data[i].lx-0))).toString().formatMoney(); 
            //实还日期
            var hkrq=data[i].hkrq==undefined?'':data[i].hkrq.split(' ')[0]; 
            //实还本金(元)
            var shbj=data[i].shbj.toString().formatMoney();
            //实还利息(元)
            var shlx=data[i].shlx.toString().formatMoney();
            //逾期天数(天)   
            var yqts=data[i].yqts;
            //已还本息(元)
            var yhbx=data[i].bx.toString().formatMoney();
            var state=data[i].state.toString(); 
            var stateName=dataDic.dicPaymentState(data[i].state); 
            if(state!='1'){
                hkrq='--';
                shbj='--';
                shlx='--';
                yhbx='--';
            }
            html+='<tr>';
            html+='<td>'+qs+'</td>';
            html+='<td>'+yhkr+'</td>';
            html+='<td>'+bx+'</td>';
            html+='<td>'+hkrq+'</td>';
            html+='<td>'+shbj+'</td>';
            html+='<td>'+shlx+'</td>';
            html+='<td>'+yqts+'</td>';
            html+='<td>'+yhbx+'</td>';
            html+='<td>'+stateName+'</td>';
            if(state=='1'){
                html+='<td>--</td>';
            }else{
                html+='<td><a data-id="'+data[i].id+'" class="viewLink" href="javascript:void(0);">立即还款</a></td>';
            } 
            html+='</tr>';
        }
    }
    $("#loadDespList").html(html); 
}; 
//获取账户余额
var getBanlance = function(){
    $.lbdAjax({
        url :'/user/banlance',
        type:'POST',
        dataType:'JSON',
        async:false,
        data:{_csrf:$("#_csrf").val()},
        success:function(msg){ 
            var balance=msg.msg.data.balance;  
            $('#accountBalance').val(balance);
        },
        error:function(msg){
            layer.msg(JSON.stringify(msg));
        }
    }); 
}; 
//获取立即还款弹框的信息
var getPayment=function(planId){ 
    $.lbdAjax({
        url :'/account/loan/loanPaybackInfo',
        type:'GET',
        dataType:'JSON',
        async:false,
        data:{
            planId:planId,
            _csrf:$("#_csrf").val() 
        },
        success:function(msg){  
            var msg=eval(msg.data);
            // PayInfo.bj=msg.bj;
            // PayInfo.lx=msg.lx;
            PayInfo.yqts=msg.yqts;
            PayInfo.whfx=msg.whfx;
            PayInfo.yqlv=msg.yqlv;
            PayInfo.total=msg.total;
            PayInfo.id=msg.id;
            PayInfo.bx=msg.bx;
        },
        error:function(msg){
            layer.msg(JSON.stringify(msg));
        }
    }); 
};
//验证交易密码格式
var validatePass=function(value){
    if(value.length==0){
        errorEvent('请输入交易密码');
        return false; 
    } 
    correctEvent(); 
    return true;
};
//验证交易密码是否正确
var validatePassDataFun=function(value){
    if(validatePassData(value)){
        errorEvent('交易密码错误');
        return false; 
    }  
    correctEvent(); 
    return true;
};
//验证交易密码是否正确
var validatePassData=function(value){
    var flag=true;
    $.lbdAjax({
        url :'/account/loan/valadatePass',
        type:'GET',
        dataType:'JSON',
        async:false, 
        data:{
            tradingPassword:commonUtils.shaPassText(value.replace(/\s+/g,"")).toUpperCase(),
            _csrf:$("#_csrf").val() 
        },
        success:function(msg){  
            var msg=eval(msg);
            if(msg.state=='SUCCESS'){
                flag=false; 
            }  
        },
        error:function(msg){
            layer.msg(JSON.stringify(msg));
        }
    }); 
    return flag; 
};

//验证错误提示
var errorEvent=function(text){ 
    $('#errorText').removeClass('invisibility').addClass('visibility');
    $('#errorText').html(text);
    $('.tradePassword').addClass('error');  
};
//验证正确恢复样式
var correctEvent=function(){
    $('#errorText').removeClass('visibility').addClass('invisibility');
    $('.tradePassword').removeClass('error');  
}; 
//跳转到设置交易密码
var changeSetPass=function(){
    setPassDialog.close();
    changeCurrentMenu('/account/securitySetting/setDealPwd','securitySetting_sub_m_btn');
};
//跳转到忘记密码
var changeForgetPass=function(){
    payDialog.close();
    changeCurrentMenu('/account/securitySetting/findDealPwd','securitySetting_sub_m_btn');
};
//提交立即还款
var submitPayment=function(id,tradingPassword){
    $.ajax({
        url :'/account/loan/paymentSubmit',
        type:'POST',
        dataType:'JSON', 
        data:{ 
            id:id,
            tradingPassword:tradingPassword,
            _csrf:$("#_csrf").val() 
        },
        beforeSend: function(){ 
            $('#btnPaymentNow').val('还款中...');
            $('#btnPaymentNow').addClass('disabled');
        },
        success:function(msg){  
            var msg=eval(msg);
            // console.log(msg);
            if(msg.state=='SUCCESS'){
                //关闭上一个弹框
                payDialog.close(); 
                //弹出成功的弹框
                var html='';
                html+='<div class="dialog_wrapper loanDialogSuccess dialog">';
                html+='<div class="ok icon-ok"></div>';
                html+='<p class="tip orange">本期还款已提交成功！</p>';
                html+='<p class="text">预计2小时内资金还款到投资人账户！</p>';
                html+='</div>';
                var submitDialog = $.dialog({
                    dialogDom:html,
                    isClose:false,
                    className:'dialog_box'
                });
                $('.dialog_close_btn').click(function(){
                    submitDialog.close();
                });    

                var timer = setTimeout(function(){
                    submitDialog.close(); 

                    //还款成功 刷新列表
                    getLoanDespList(1,targetId); 
                },2000); 

            }else{
                layer.msg(JSON.stringify(msg.message)); 
            } 
        },
        error:function(msg){
            layer.msg(JSON.stringify(msg.message));
        }
    }); 
};
//弹出立即还款对话框
var dialogPayment=function(planid){
    //已经设置交易密码  
    //获取账户余额
    getBanlance();
    var balance=$('#accountBalance').val();  
    //获取立即还款信息  
    getPayment(planid); 
    var payTotal=PayInfo.total;
    var html='';
    //格式化显示字段
    var formatBalance=balance.toString().formatMoney();
    var payMoney=PayInfo.bx.toString().formatMoney();
    var deadlineDay=PayInfo.yqts;
    var fineMoneyRate=PayInfo.yqlv;
    var fineMoneyAccount=PayInfo.whfx.toString().formatMoney();
    var fineTotal=PayInfo.total.toString().formatMoney();
    var id=PayInfo.id;
    if((balance-payTotal)>0){
        //立即还款   
        html+='<div class="dialog_wrapper loanRepayDialog dialog">';
        html+='<div class="dialog_close_btn icon-zh-close"> </div>';
        html+='<div class="title">';
        html+='立即还款';
        html+='</div>';
        html+='<div class="loaninfo">';
        html+='<div><span class="label">可用余额：</span><span class="value orange">￥'+formatBalance+'</span></div>';
        html+='<div><span class="label">本期还款金额：</span><span class="value">￥'+payMoney+'</span></div>';
        html+='<div><span class="label">本期逾期天数：</span><span class="value">'+deadlineDay+' 天</span></div>';
        html+='<div><span class="label">逾期罚息利率：</span><span class="value">'+fineMoneyRate+'%</span></div>';
        html+='<div><span class="label">逾期罚息金额：</span><span class="value">￥'+fineMoneyAccount+'</span></div>';
        html+='<div><span class="label">共计还款金额：</span><span class="value orange">￥'+fineTotal+'</span></div>';
        html+='<div>';
        html+='<span class="label">交易密码：</span>';
        html+='<span class="inputPass"><span id="errorText" class="invisibility"></span><input class="tradePassword" placeholder="请输入交易密码" type="password" id="tradePassword" /></span>';
        html+=' </div>';
        html+='</div>';
        html+='<div class="forgetPass">';
        html+='<a href="javascript:void(0);" class="forgetLink" onclick="changeForgetPass();">忘记密码</a>';
        html+='</div>';
        html+='<div class="buttonDiv">';
        html+='<input type="button" data-id="'+id+'" class="button lmybtn" id="btnPaymentNow" value="立即还款"> ';
        // html+='<input type="button" class="button lmybtn disabled" value="还款中">';
        html+='</div>';
        html+='</div>';  
    }else{  
        //立即充值 
        html+='<div class="dialog_wrapper loanPayDialog dialog">';
        html+='<div class="dialog_close_btn icon-zh-close"> </div>';
        html+='<div class="title">';
        html+='立即还款';
        html+='</div>';
        html+='<div class="loaninfo">';
        html+='<div><span class="label">可用余额：</span><span class="value orange">￥'+formatBalance+'</span></div>';
        html+='<div><span class="label">本期还款金额：</span><span class="value">￥'+payMoney+'</span></div>';
        html+='<div><span class="label">本期逾期天数：</span><span class="value">'+deadlineDay+'天</span></div>';
        html+='<div><span class="label">逾期罚息利率：</span><span class="value">'+fineMoneyRate+'%</span></div>';
        html+='<div><span class="label">逾期罚息金额：</span><span class="value">￥'+fineMoneyAccount+'</span></div>';
        html+='<div><span class="label">共计还款金额：</span><span class="value orange">￥'+fineTotal+'</span></div>';
        html+='</div>';
        html+='<div class="buttonDiv">';
        html+='<input type="button" onclick="payAccount()" class="button lmybtn" style="margin-top:14px;" value="立即充值">';
        html+='</div>';
        html+='</div>';  
    }
    payDialog = $.dialog({
        dialogDom:html,
        isClose:true,
        className:'dialog_box'
    });
    $('.dialog_close_btn').click(function(){
        payDialog.close();
    });
    //交易密码验证
    $('#tradePassword').focus(function(){
        $(this).addClass('active');
    });
    $('#tradePassword').blur(function(){
        $(this).removeClass('active');
    });
    //交易密码验证
    $('#tradePassword').bind('input',function(){ 
        var pass=$('#tradePassword').val(); 
        validatePass(pass);
    });

    //立即还款
    $('#btnPaymentNow').bind('click',function(){
        var pass=$('#tradePassword').val(); 
        var tradingPassword=commonUtils.shaPassText(pass.replace(/\s+/g,"")).toUpperCase();
        var id=$(this).attr('data-id');
        if(validatePass(pass)){  
            if(validatePassDataFun(pass)){
                submitPayment(id,tradingPassword); 
            }  
        }; 
    });  
};
//弹出设置交易密码对话框
var dialogSetPass=function(){
    //还未设置交易密码 
    var html='';
    html+='<div class="dialog_wrapper SetPassDialog dialog">';
    html+='<div class="dialog_close_btn icon-zh-close"> </div>';
    html+='<div class="title">';
    html+='设置交易密码';
    html+='</div>';
    html+='<p class="desp">为保障您的提现安全，请先设置交易密码后再还款</p>';
    html+='<div class="buttonDiv">';
    html+='<input type="button" class="button lmybtn" onclick="changeSetPass();" value="立即设置">';
    html+='</div>';
    html+='</div>';

    setPassDialog = $.dialog({
        dialogDom:html,
        isClose:true,
        className:'dialog_box'
    });
    $('.dialog_close_btn').click(function(){
        setPassDialog.close();
    });
};
//立即充值
var payAccount=function(){
    payDialog.close();
    changeCurrentMenu('/account/chargeManagement/recharge','recharge_sub_m_btn');
};

var payDialog={};
var setPassDialog={};
var targetId='';
$(function(){  
    if($('#targetId').val()==undefined||$('#targetId').val()==''){
        changeCurrentMenu('/account/maintain/overview','overview_sub_m_btn');
    }else{
        //加载
        targetId=$('#targetId').val().split('?')[0];    
        loanViewDespBaseinfo(targetId);
        getLoanDespList(1,targetId); 
    } 
    
    //立即还款事件
    $('#loadDespList').on('click','.viewLink',function(){  
        var planid=$(this).attr('data-id');
        //判断是否设置交易密码
        validateUserValidAuthenticateType(function(msg){  
            var auth=msg.msg.auth.join(',');   
            if(auth.indexOf(5)!=-1){
                dialogPayment(planid); 
            }else{
                dialogSetPass();
            }
        },
        function(msg){

        }); 
    });

    //下载协议
    $('#protocolDown').bind('click',function() {   
        $.ajax({
            url :'/account/loan/loanProtocolDownload',
            type:'GET',
            dataType:'JSON',  
            data:{ 
                targetId:targetId, 
                _csrf:$("#_csrf").val() 
            }, 
            success:function(msg){  
                var msg=eval(msg); 
                // console.log(msg) 
                if(msg.state=="SUCCESS"){
                    var data=msg.data;
                    for(var j=0;j<data.length;j++){
                       if(data[j].orderId==''){
                            var contractServer=$('#contractServer').val();
                            var url=contractServer+data[j].agreementFileName;
                            if(data[j].createdStatus=="Y"){ 
                                window.open(url,"_blank"); 
                            }else{ 
                                $.ajax({
                                    url :'/account/loan/loanProtocolCreate',
                                    type:'GET',
                                    dataType:'JSON',  
                                    data:{ 
                                        targetId:targetId, 
                                        _csrf:$("#_csrf").val() 
                                    }, 
                                    success:function(msg){   
                                        // console.log(msg);
                                        if(msg.state=='SUCCESS'){
                                            window.open(url,"_blank");  
                                        }else{
                                            layer.msg('合同生成失败，请联系管理员！');
                                        }
                                    },
                                    error:function(msg){
                                        // console.log("error");
                                        layer.msg(JSON.stringify(msg.message));
                                    }
                                });  
                            }
                            
                       } 
                    }
                } 

            },
            error:function(msg){
                // console.log("error");
                layer.msg(JSON.stringify(msg.message));
            }
        });   
    });
      
});

