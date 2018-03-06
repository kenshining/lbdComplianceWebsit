 //微信分享
var shareByWechat = function(){
	layer.open({
		content:$('#wechatContent'),	 
		type: 1,
        title: false,
        area:['530px','500px'],
        shade: [0.8, '#000']
	});
};
var shareByQQ = function(){							
	var _blank = window.open("_blank");
	_blank.location.href="http://connect.qq.com/widget/shareqq/index.html?url="+encodeURIComponent($("#cardid").html())+"&title=乐百贷&desc=躺着就能把钱赚，快来点一点啦！&summary=躺着就能把钱赚，快来点一点啦！&site=lebaidai&pics=http://www.lebaidai.com/img/shares_logo.png";
};
// qq空间分享
var shareByQZone = function(){
	var _blank = window.open("_blank");
	_blank.location.href="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url="+
	encodeURIComponent($("#cardid").html())+
	"&title=乐百贷&desc=躺着就能把钱赚，快来点一点啦！&summary=躺着就能把钱赚，快来点一点啦！&site=lebaidai&pics="+encodeURIComponent("http://www.lebaidai.com/img/shares_logo.png");
};
// 微博分享
var shareWeibo = function(){
	var _blank = window.open("_blank");
	_blank.location.href="http://service.weibo.com/share/share.php?appkey=1750780991&url="+
	encodeURIComponent($("#cardid").html())+
	"&title=乐百贷（躺着就能把钱赚，快来点一点啦！）&pic="+encodeURIComponent("http://www.lebaidai.com/img/shares_logo.png");
};
$(function(){
	//生成微信分享二维码
	$("#nncode").qrcode({
		//老乐百贷注册地址  http://app.lebaidai.com/reg/main
		text: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx66fe99e3dc3dc267&redirect_uri=http%3A%2F%2Fapp.lebaidai.com%2Freg%2Fmain&scope=snsapi_base&state=123#wechat_redirec*"+$("#identityCode").val(), 
		height: 203, //高度
		width: 204 //宽度
	});


	ZeroClipboard.setMoviePath("/plugins/zeroclipboard/ZeroClipboard.swf");  
	var clip = new ZeroClipboard.Client(); // 新建一个对象
	console.log(clip)
	clip.setHandCursor( true );
	clip.setText($('#cardid').html()); // 设置要复制的文本。 
	clip.addEventListener( "mouseUp", function(client) {
		layer.msg("复制成功！");
	}); 
	// 注册一个 button，参数为 id。点击这个 button 就会复制。
	//这个 button 不一定要求是一个 input 按钮，也可以是其他 DOM 元素。
	clip.glue("copycardid",'zeroClipboardDiv'); // 和上一句位置不可调换 
	  
});