var page=1;
var rows=10;
//获取协议列表
var getProtocolList=function(){  
     $.lbdAjax({
        url :'/aboutUs/platformProtocolList',
        type:'GET',
        dataType:'JSON',
        data:{  
           page:page,
           rows:rows,
           max:'1',
           _csrf:$("#_csrf").val()
        },
        success:function(msg){
            // console.log(msg) 
            if(msg.state=='SUCCESS'){ 
                var data=msg.data;   
                var html=''; 
                for(var i=0;i<data.content.length;i++){ 
                    html+='<li class="industryNewsInfo">';
                    html+='<em class="icon icon-labout_point"></em>';
                    html+='<a class="protocolLink" target="_blank" href="/agreement/protocol_detail?protocolId='+data.content[i].id+'">'+data.content[i].title+'</a>';
                    html+='<span class="newsDate right">'+data.content[i].publishTime+'</span>';
                    html+='</li>';
                }
                $("#listHtml").html(html);
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
	getProtocolList();
});