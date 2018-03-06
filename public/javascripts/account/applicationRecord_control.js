var rows=10;
var visiblePages=5; 
//获取申请记录列表
var getApplicationList=function(page){
	$.lbdAjax({
        url :'/account/loan/applicationList',
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
              	applicationListRander(data.content);
                if(data.content.length!=0){
                    $.jqPaginator("#applicationRecordPage",{
                        totalPages : data.totalPages,
                        visiblePages: visiblePages,
                        currentPage: (data.number+1),
                        totalnum:data.totalElements,
                        onPageChange: function (num, type) {
                            getApplicationListChange(num);
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
//获取申请记录列表分页
var getApplicationListChange=function(page){
	$.lbdAjax({
        url :'/account/loan/applicationList',
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
              	applicationListRander(data.content); 
            }else{
                layer.msg(JSON.stringify(msg));
            } 
        },
        error:function(msg){  
            layer.msg(JSON.stringify(msg));

        }
    }); 
};
//渲染页面
var applicationListRander=function(data){
	$("#applicationList").html("");
    var html='';
    if(data.length==0){  	
    	html+='<tr class="datanull">';
    	html+='<td colspan="9">';
    	html+='<div class="contentNullImg"></div>';
    	html+='<div class="contentNullText">暂无申请记录</div>';
    	html+='</td>';
    	html+='</tr>';
        $('.lmy_investPage').css('display','none');     
    }else{
    	$('.lmy_investPage').css('display','block');  
    	for(var i=0;i<data.length;i++){  
            var name=data[i].appName.replace(/^(.{1}).*$/,'$1**');
            var telphone=data[i].appMobile.replace(/^(\d{3})(\d*)(\d{4})$/,'$1****$3');
            var amount=data[i].appAmount;
            var cityName=data[i].cityName;
            var createdDate=data[i].createdDate;
            var appStatus=data[i].appStatus.toString();
            var appStatusName='';
            if(appStatus=='0'){
                appStatusName='审核中';
            }else if(appStatus=='1'){
                appStatusName='审核成功';
            }else if(appStatus=='2'){
                appStatusName='审核失败';
            }
    		html+='<tr>';
	    	html+='<td>'+name+'</td>';
	    	html+='<td>'+telphone+'</td>';
	    	html+='<td>'+amount+'</td>';
	    	html+='<td>'+cityName+'</td>';
	    	html+='<td>'+createdDate+'</td>';
	    	html+='<td>'+appStatusName+'</td>';
	    	html+='</tr>';
    	}  
    }
    $("#applicationList").html(html);
};
$(function(){
	//获取数据
	getApplicationList(1);

});