var rows=10;
var visiblePages=5; 
var commonUtils=new CommonUtils();
var dataDic=new DataDictionary();
//获取邀请总览
var getInviteCount=function(){
	$.lbdAjax({
        url :'/account/invite/inviteCount',
        type:'GET',
        dataType:'JSON',
        data:{  
           _csrf:$("#_csrf").val()
        },
        success:function(msg){  
            if(msg.state=='SUCCESS'){ 
                var data=msg.data; 
                $("#recharge").html(data.recharge);
                $("#income").html(data.income.toString().formatMoney());
                $('#invest').html(data.invest);
                $("#register").html(data.register);   
            }else{
                layer.msg(JSON.stringify(msg));
            } 
        },
        error:function(msg){  
            layer.msg(JSON.stringify(msg));

        }
    }); 
};
//获取邀请记录列表
var getInviteList=function(page){
    $.lbdAjax({
        url :'/account/invite/invitelist',
        type:'GET',
        dataType:'JSON',
        data:{  
            page:page,
            rows:rows,
           _csrf:$("#_csrf").val()
        },
        success:function(msg){ 
            // console.log(msg);
            if(msg.state=='SUCCESS'){ 
                var data=msg.data;   
                inviteListRander(data.content);
                if(data.content.length!=0){ 
                    $.jqPaginator("#inviteRecordPage",{
                        totalPages : data.totalPages,
                        visiblePages: visiblePages,
                        currentPage: (data.number+1),
                        totalnum:data.totalElements,
                        onPageChange: function (num, type) {
                            getInviteListChange(num);
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
//获取邀请记录列表分页
var getInviteListChange=function(page){
    $.lbdAjax({
        url :'/account/invite/invitelist',
        type:'GET',
        dataType:'JSON',
        data:{  
            page:page,
            rows:rows,
           _csrf:$("#_csrf").val()
        },
        success:function(msg){  
            if(msg.state=='SUCCESS'){ 
                var data=msg.data;   
                inviteListRander(data.content);
            }else{
                layer.msg(JSON.stringify(msg));
            } 
        },
        error:function(msg){  
            layer.msg(JSON.stringify(msg));

        }
    }); 
};
var inviteListRander=function(data){
    $("#inviteRecordList").html("");
    var html='';
    if(data.length==0){ 
        html+='<tr class="datanull">';
        html+='<td colspan="9">';
        html+='<div class="contentNullImg"></div>';
        html+='<div class="contentNullText">暂无邀请记录</div>';
        html+='</td>';
        html+='</tr>'; 
        $('.lmy_investPage').css('display','none');     
    }else{
        $('.lmy_investPage').css('display','block'); 
        for(var i=0;i<data.length;i++){ 
            var telphone=data[i].telephone;
            var regTel=/^(\d{3})\d+(\d{4})$/;
            var telphoneview=telphone.replace(regTel,'$1****$2');
            var isRegist='是';
            var isPay=dataDic.dicIsDO(data[i].rechargeState);
            var isInvest=dataDic.dicIsDO(data[i].investState);
            var source=dataDic.dicplantFrom(data[i].plantFrom);
            html+='<tr>';    
            html+='<td>'+telphoneview+'</td>';    
            html+='<td>'+isRegist+'</td>';    
            html+='<td>'+isPay+'</td>';    
            html+='<td>'+isInvest+'</td>';    
            html+='<td>'+source+'</td>';    
            html+='</tr> '; 
        } 
    }
    $("#inviteRecordList").html(html); 
};
$(function(){ 
    //获取数据
    getInviteCount();
    getInviteList(1); 
});