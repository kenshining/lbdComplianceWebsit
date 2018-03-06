var rows=10;
var visiblePages=5; 
var commonUtils=new CommonUtils();
var dataDic=new DataDictionary();

var orderid=''; 
//我的投资详情列表
var getInvestDespList=function(page,orderid){
    $.lbdAjax({
        url :'/account/investment/getInvestDespByPage',
        type:'GET',
        dataType:'JSON',
        data:{ 
           page:page,
           rows:rows,
           orderid:orderid,
           _csrf:$("#_csrf").val()
        },
        success:function(msg){ 
            // console.log(msg);
            if(msg.state=='SUCCESS'){ 
                var data=msg.data;    
                investmentDespListRander(data.content);  
                if(data.content.length!=0){
                    $.jqPaginator("#investDespPage",{
                        totalPages : data.totalPages,
                        visiblePages: visiblePages,
                        currentPage: (data.number+1),
                        totalnum:data.totalElements,
                        onPageChange: function (num, type) {  
                            // console.log(num);
                            getInvestDespListByPageChange(num,orderid);
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
//我的投资详情列表分页
var getInvestDespListByPageChange=function(page,orderid){
    $.lbdAjax({
        url :'/account/investment/getInvestDespByPage',
        type:'GET',
        dataType:'JSON',
        data:{  
           page:page,
           rows:rows,
           orderid:orderid,
           _csrf:$("#_csrf").val()
        },
        success:function(msg){  
            if(msg.state=='SUCCESS'){ 
                var data=msg.data;   
                investmentDespListRander(data.content); 
            }else{
                layer.msg(JSON.stringify(msg));
            } 
        },
        error:function(msg){  
            layer.msg(JSON.stringify(msg)); 
        }
    }); 
};
//渲染我的投资详情列表数据
var investmentDespListRander=function(data){
    $('#investmentDespList').html(''); 
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
            //本期收款日
            var yhkr=data[i].yhkr.split(' ')[0];
            //应收本息(元)= 应收本金+应收利息 
            var interestReceivable=((data[i].bj-0)+(data[i].lx-0)).toString().formatMoney(); 
            //实收日期
            var hkrq=data[i].hkrq; 
            //实收本金(元)
            var receiptBj=data[i].paidBj.toString().formatMoney();
            //实收利息(元)
            var receiptLx=data[i].paidLx.toString().formatMoney();
            //逾期天数(天)
            var lateDays=data[i].lateDays;
            //已收本息(元)
            var bx=((receiptBj-0)+(receiptLx-0)).toString().formatMoney(); 
            //状态
            var state=data[i].state; 
            var stateName=dataDic.dicInvestmentState(state);
            if(state==2||state==3){
                hkrq="--";
                receiptBj="--";
                receiptLx="--";
                bx="--"; 
            }
            html+='<tr>';
            html+='<td>'+qs+'</td>';
            html+='<td>'+yhkr+'</td>';
            html+='<td>'+interestReceivable+'</td>';
            html+='<td>'+hkrq+'</td>';
            html+='<td>'+receiptBj+'</td>';
            html+='<td>'+receiptLx+'</td>';
            html+='<td>'+lateDays+'</td>';
            html+='<td>'+bx+'</td>';
            html+='<td>'+stateName+'</td>';
            html+='</tr>';
        }     
    }
    $('#investmentDespList').html(html); 
};
//获取我的账户我的投资详情中的基本信息
var getInvestDespBaseinfo=function(orderid){
    $.lbdAjax({
        url :'/account/investment/getInvestDespBaseinfo',
        type:'GET',
        dataType:'JSON',
        data:{  
           orderid:orderid, 
           _csrf:$("#_csrf").val()
        },
        success:function(msg){  
            if(msg.state=='SUCCESS'){ 
                var data=msg.data;    
                // console.log(data);
                $("#receiveBX").html(data.receiveBX.toString().formatMoney());
                $("#receivePrincipal").html(data.receivePrincipal.toString().formatMoney());
                $("#receivedInterest").html(data.receivedInterest.toString().formatMoney());

                //新增 投资金额 使用红包
                $("#buyAmt").html(data.buyAmt.toString().formatMoney()); 
                $("#redAmt").html(data.redAmt.toString().formatMoney()); 

                $("#loanNumber").html(data.loanNumber); 
                $("#nhsyl").html((commonUtils.floatMul(data.nhsyl,100)).toString()+'%');
                $('#htqx').html(data.htqx+'个月');
                //产品名称
                var productid=data.productid.toString();
                var productname=dataDic.dicProductid(productid); 
                $("#productid").html(productname);
                //还款方式
                var hkfs=data.hkfs.toString(); 
                var hkfs_name=dataDic.dicRepaymentMethod(hkfs); 
                $('#hkfs').html(hkfs_name); 

                var lendingDay=data.lendingDay.split(' ')[0];
                var completionTime=data.completionTime.split(' ')[0];
                $("#loanTime").html(lendingDay+'~'+completionTime); 
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
    orderid=$('#orderid').val();
    // console.log(orderid);
    if(orderid!=''){
        orderid=orderid.split('?')[0];
    } 
    // console.log(orderid);
	getInvestDespList(1,orderid);
    getInvestDespBaseinfo(orderid);

    //下载协议
    $('#protocolDown').bind('click',function() {  
        $.ajax({
            url :'/account/investment/investmentProtocolDown',
            type:'GET',
            dataType:'JSON', 
            async:false,
            data:{ 
                orderId:orderid, 
                _csrf:$("#_csrf").val() 
            }, 
            success:function(msg){  
                var msg=eval(msg); 
                if(msg.state=='SUCCESS'){ 
                    var contractServer=$("#contractServer").val();
                    var url=contractServer+msg.data.agreementFileName;
                    if(msg.data.createdStatus=="Y"){ 
                        window.open(url,"_blank"); 
                    }else{ 
                        $.ajax({
                            url :'/account/investment/investmentProtocolCreate',
                            type:'GET',
                            dataType:'JSON',  
                            data:{ 
                                orderId:orderid, 
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
                }else{
                   layer.msg(JSON.stringify(msg.message)); 
                }
            },
            error:function(msg){
                // console.log('error');
                layer.msg(JSON.stringify(msg.message));
            }
        });   
    });
});