var rows=10;
var visiblePages=5;
//媒体报道列表
var getList=function(page){  
    $.lbdAjax({
        url :'/aboutUs/mediaReportByPage',
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
                Rander(data);  
                if(data.length!=0){
                    $.jqPaginator("#newsListPage",{
                        totalPages : data.totalPages,
                        visiblePages: visiblePages,
                        currentPage: (data.number+1),
                        totalnum:data.totalElements,
                        onPageChange: function (num, type) {
                            getListChange(num);
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
//媒体报道列表分页
var getListChange=function(page){
	$.lbdAjax({
        url :'/aboutUs/mediaReportByPage',
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
                Rander(data);   
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
var Rander=function(data){ 
	$('#listHtml').html('');
	var html='';
	if(data.content.length>0){
		for(var i=0;i<data.content.length;i++){
			var content=data.content;
			var title=content[i].title;
			var preview=content[i].preview.replace('&nbsp;',''); 
            if(preview.length>74){
                preview=content[i].preview.substring(0,73)+'...';
            }  
			var createDate=content[i].createdDate; 
            var imageServer=$('#imageServer').val(); 
			var imgUrl=imageServer+content[i].previewImg;
			var id=content[i].id; 

			html+='<div class="newslist clearfix">';
			html+='<div class="left newsImages">';
			html+='<img src="'+imgUrl+'">';
			html+='</div>';
			html+='<div class="left newsinfo">';
			html+='<p class="newsTitle"><a onclick="changeCurrentMenu(\'/aboutUs/newsInfo?id='+id+'&type=news\',\'menuMediaReport\');" href="javascript:void(0);">'+title+'</a></p>';
			html+='<p class="newsSimple">'+preview+'</p>';
			html+='</div>';
			html+='<div class="right newsDate">';
			html+='<span>'+createDate+'</span>';
			html+='</div>';
			html+='</div>'; 

		} 
		$('.lmy_investPage').css('display','block'); 
	}else{
		$('.lmy_investPage').css('display','none'); 
	}
	$('#listHtml').html(html);
};

$(function(){
	getList(1);
});