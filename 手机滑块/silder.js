;(function($){
    var oDiv=null;
    var $oUl=null;
    var $oLi=null;
    var startPosX=null;
    var PosX=0;
    var rPosX=0;
    var oIndex=0;
    var timer=null;
    var $IndexA=null;
    var AutoTimer=2000;
    var silder="silder";
function AutoStart(){
  if(timer==null){
    timer=setInterval(function(){
      oIndex++;
      oIndex>$oLi.length-1?oIndex=0:oIndex;
      rPosX=oIndex*$oLi.width();
      SelectIndex();
    },AutoTimer);
  }
}
function AppendIndex(){
  var sIndex=$("<div class='s_index'></div>");
  for(var i=0;i<$oLi.length;i++){
    if(i==0)
    {
      sIndex.append("<a href='javascript:;' class='selected'></a>");
      continue;
    }
    sIndex.append("<a href='javascript:;'></a>");
  }
  sIndex.appendTo(oDiv);
}
function SelectIndex(){
  startPosX=null;
  if(rPosX<0){
    $oUl.animate({"left":0},100);
    rPosX=0;
    return;
  }
  var right=$oUl.width()-$oLi.width();
  if(rPosX>right){
    $oUl.css("left",-right);
    rPosX=right;
  }
  oIndex=Math.round(rPosX/$oLi.width());
  $IndexA.siblings().removeClass("selected");
  $IndexA.eq(oIndex).addClass("selected");
  rPosX=$oLi.width()*Math.round(rPosX/$oLi.width());
  if(silder=="silder"){
    $oUl.animate({"left":-rPosX},200);
    return;
  }
  if(silder=="ani")
  {
    $oUl.css("left",-rPosX);
    $oLi.eq(oIndex).animate({"opacity":100},AutoTimer);
    $oLi.eq(oIndex-1).animate({"opacity":0},AutoTimer);
  }
}
$(window).on("resize",function(){
  changWindow();
});
function EventBind(){
  oDiv.on("touchstart",function(){
    if(timer!=null){
      clearInterval(timer);
      timer=null;
    }
  }).on("touchmove",function(){
    if(startPosX==null){
      startPosX=firstTouch.pageX;
    }else
    {
      PosX=startPosX-firstTouch.pageX;
      startPosX=firstTouch.pageX;
    }
    rPosX+=PosX;
    $oUl.css("left",-rPosX);
  }).on("touchend",function(){
    SelectIndex();
  });
}
function changWindow(){

    $oLi.width($(document).width());
    oDiv.height($oLi.height());
    $oUl.width($oLi.length*$oLi.width());

}
$.fn.MoveSilder = function(silders,AutoTimers) {
    oDiv=$(this);
    $oUl=oDiv.find("ul");
    $oLi=$oUl.find("li");
    if(AutoTimers!=null)AutoTimer=AutoTimers;
    if(silders!=null)silder=silders;
    AppendIndex();
    changWindow();
    AutoStart();
    EventBind();
    $IndexA=$(".s_index").find("a");
}
})(Zepto)