/**
* 上传用户头像页面使用
*
**/
//选择图片触发方法。
var cropper;
var options = {
	thumbBox: '.thumbBox',
	spinner: '.spinner'
};

var preViewUploadPic = function(fileBtn){

	//取得图片的扩展名
	var ext = new String(fileBtn.value).substring(fileBtn.value.lastIndexOf(".")+1).toLowerCase();
	//判断扩展名是否支持
	if(ext!='jpg' && ext!='png'){
		layer.msg("仅支持JPG/PNG格式的图片！");
		return;
	}
	//判断图片大小不超过2M
    var byteSize  = fileBtn.files[0].size;
    //console.log("byteSize " + byteSize);
    if(byteSize > (1024 * 1024 *5)){
    	//文件大小超过2M不允许上传
    	layer.msg("您选择的文件过大，文件大小应小于5MB。");
    	return;
    }
    
	//针对IE做特殊处理
	var isIE = navigator.userAgent.match(/MSIE/)!= null,
		isIE6 = navigator.userAgent.match(/MSIE 6.0/)!= null;

	$("#initOrChangePanel").fadeOut('fast',function(){
		$("#controlPanel").fadeIn('fast');
	});
	layer.load(2);
	var file = fileBtn.files[0];
	var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(e){
        /*$("#preViewPanel").attr("src",this.result);
        $("#photo_preview_img").attr("src",this.result);*/
        options.imgSrc = this.result;
		cropper = $('.jcrop_wrapper').cropbox(options);
    }
	layer.closeAll();
	$(document).unbind('mousewheel DOMMouseScroll');
	
};
//移动或者切换选项内容更换位置
var showPreView = function(c){
	//console.log(c);
	if(parseInt(c.w) > 0){
		$("#photo_preview_img").css({
          width: '280px',
          height: '187px',
          marginLeft: '-' + c.x + 'px',
          marginTop: '-' + c.y + 'px'
        });
	}
};
//放大图片内容
var zoomInPic = function(){
	cropper.zoomIn();
};
//缩小图片内容
var zoomOutPic = function(){
	cropper.zoomOut();
};
//裁切预览
var cropperPic = function(){
	var img = cropper.getDataURL();
	$("#photo_preview_img").attr("src",img);
};
var saveAndUploadPic = function(){
	var img = $("#photo_preview_img").attr("src");
	if(img == "/dist/images/kong.png"){
		layer.msg("请先“预览”裁切头像效果后再保存图片。");
		return;
	}
	$.lbdAjax({
		url:"/securitySetting/saveUserPic",
		dataType:"JSON",
		type:"POST",
		data:{
			_csrf:$("#_csrf").val(),
			userPicBase64:$("#photo_preview_img").attr("src")
		},
		success:function(msg){
			if(msg.state === 0){
				//绑定头部头像显示
				$("#top_userPhoto").attr("src",msg.imageServer+msg.imageUrl).removeClass('icon_lbd');
				$("#user_top_pic_s").attr("src",msg.imageServer+msg.imageUrl);
				$("#user_top_pic_s").show();
				$("#controlPanel").fadeOut('fast',function(){
					$("#initOrChangePanel").fadeIn('fast');
				});
				/*头像设置成功弹出框*/
				var Dialog = $.dialog({
					dialogDom:'<div class="icon_wrapper"><em class="icon icon-gary-ok"></em><img src="'+msg.imageServer+msg.imageUrl+'"/></div><p class="orange">恭喜您，头像设置成功！</p>',
					className:'dia_wrapper photo_dialog',
					isClose:false
				});
				timer = setTimeout(function(){
					Dialog.close();
					changeCurrentMenu('/account/securitySetting/securitySetting','securitySetting_sub_m_btn');
				},2000);
			}else{
				layer.msg("头像上传失败，请稍后再试。");
			}
		}
	});
};