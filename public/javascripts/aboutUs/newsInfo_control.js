var dic=new DataDictionary();
var getInfo=function(type,newsId){  
    $.lbdAjax({
        url :'/aboutUs/newsInfoContent',
        type:'GET',
        dataType:'JSON',
        data:{ 
           type:type,
           newsId:newsId,
           _csrf:$("#_csrf").val()
        },
        success:function(msg){  
            if(msg.state=='SUCCESS'){ 
                var data=msg.data;   
                var category=data.category;  
                $("#history").html(dic.dicNewsType(category));

                $("#history").bind('click',function(){
                    var str=dic.dicNewsHref(category);
                    changeCurrentMenu(str[0],str[1]); 
                });

                // $("#history").attr('href',dic.dicNewsHref(category)); 
                $("#titletip").html(data.title);
                $("#title").html(data.title);
                $("#time").html(data.createdDate);
                $("#viewCount").html(data.pageView); 
                $("#infoContent").html(data.content); 
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
	//获取内容
	var type=$("#type").val();
	var newsId=$("#newsId").val(); 
	getInfo(type,newsId); 
});