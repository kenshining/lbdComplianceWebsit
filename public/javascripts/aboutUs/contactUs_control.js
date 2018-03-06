//创建和初始化地图函数：
function initMap(){

    createMap();//创建地图

    setMapEvent();//设置地图事件

    addMapControl();//向地图添加控件

    addMarker();//向地图中添加marker

}
//创建地图函数：
function createMap(){
    
    var map = new BMap.Map("dituContent");//在百度地图容器中创建一个地图

    var point = new BMap.Point(116.362758,39.958654);//定义一个中心点坐标

    map.centerAndZoom(point,19);//设定地图的中心点和坐标并将地图显示在地图容器中

    window.map = map;//将map变量存储在全局

}
//地图事件设置函数：
function setMapEvent(){
    map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
    map.enableScrollWheelZoom();//启用地图滚轮放大缩小
    map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
    map.enableKeyboard();//启用键盘上下左右键移动地图
}
//地图控件添加函数：
function addMapControl(){
    //向地图中添加缩放控件
    var ctrl_nav = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:BMAP_NAVIGATION_CONTROL_LARGE});
    map.addControl(ctrl_nav);
    //向地图中添加缩略图控件
    var ctrl_ove = new BMap.OverviewMapControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT,isOpen:0});
    map.addControl(ctrl_ove);
    //向地图中添加比例尺控件
    // var ctrl_sca = new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_LEFT});
    // map.addControl(ctrl_sca);
}               
//标注点数组
var markerArr = [{title:"乐百贷",content:"www.lebaidai.com<br/>北京市海淀区西直门北大街32号枫蓝国际A座912室<br/>电话：400-898-6699",point:"116.362785|39.958654",isOpen:0,icon:{w:21,h:21,l:0,t:0,x:6,lb:5}}];
//创建marker
function addMarker(){
    var point = new BMap.Point(116.362758,39.958654);
    var marker = new BMap.Marker(point);// 创建标注
    var opts = {
      width : 350,     // 信息窗口宽度
      height: 100,     // 信息窗口高度
      title : "乐百贷" , // 信息窗口标题
      enableMessage:true,//设置允许信息窗发送短息
      message:"www.lebaidai.com<br/>北京市海淀区西直门北大街32号枫蓝国际A座912室<br/>电话：400-898-6699"
    }
    var infoWindow = new BMap.InfoWindow("www.lebaidai.com<br/>北京市海淀区西直门北大街32号枫蓝国际A座912室<br/>电话：400-898-6699", opts);  // 创建信息窗口对象
    marker.addEventListener("click", function(){
       map.openInfoWindow(infoWindow,point); //开启信息窗口
    });
    map.addOverlay(marker);
}
//创建InfoWindow
function createInfoWindow(i){
    var json = markerArr[i];
    var iw = new BMap.InfoWindow("<b class='iw_poi_title' title='" + json.title + "'>" + json.title + "</b><div class='iw_poi_content'>"+json.content+"</div>");return iw;}
    //创建一个Icon
    function createIcon(json){
    var icon = new BMap.Icon("http://app.baidu.com/map/images/us_mk_icon.png", new BMap.Size(json.w,json.h),{imageOffset: new BMap.Size(-json.l,-json.t),infoWindowOffset:new BMap.Size(json.lb+5,1),offset:new BMap.Size(json.x,json.h)})
    return icon;
};
$(document).ready(function(){
    //菜单变更CSS
    $("li[id^=main_nav_]").attr("class","");
    $("#main_nav_aboutUs").attr("class","sele");
    
    initMap();//创建和初始化地图
    $("a").each(function() {
    var hh = $(this).attr("href");
        if( hh == "http://map.baidu.com/?sr=1" ) {
            $(this).attr("href", "http://www.lebaidai.com");
            $(this).html('<img style="border:none;width:42px;height:31px" src="/img/about/maplogo.png">');
        }
    });
    //绑定切换选项卡事件
     $("[id$=tab]").on("click",function(){
        //清空所有选项卡得选择状态
        $("[id$=tab]").attr("class","");
        //为当天点击对象添加选中状态
        $(this).attr("class","current");
        //隐藏所有其他非相关列表内容
        $("[id$=_content]").hide();
        var tabId = $(this).attr("id");
        $("#"+tabId+"_content").show();

     });
    
});