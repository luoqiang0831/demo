;(function($){
    $(document).on('touchmove',function(e){
        e.preventDefault();
    });
$.fn.slider = function(option){
    var opts = $.extend({}, $.fn.slider.defaults, option), //配置选项
    $silder=this,
    oldPosition=0,
    curPosition=0,
    gap=0,
    prev=false,
    warpSize=opts.direction == 'top'?$(window).height():$(window).width(),
    Direction=(opts.direction == 'top'),
    Gesture=opts.direction == 'top'?'top':'left',
    lastIndex=$('.warp').children('*:last-child').index(),
    silderScale=opts.scale !=null?opts.scale*warpSize:warpSize/2;//滑动比例
    $silder.find("div").each(function(i,o){
        $(o).css({"z-index":lastIndex-i+1});
        if(i<2) $(o).css("opacity",1);
    });
    $silder.delegate("div","touchstart",function(e){

         var touch = e.touches[0];
         oldPosition = Direction ? touch.clientY: touch.clientX;
         if($(this).index()!=lastIndex)
            $(this).next().css("opacity",0);
    }).delegate("div","touchmove",function(e){

        var touch = e.touches[0],
        curPosition = Direction ? touch.clientY: touch.clientX;
        gap=curPosition-oldPosition;
        if(curPosition<oldPosition){
             if($(this).index()==0)return;
             $(this).prev().css(Gesture,warpSize+gap);
             $(this).css("opacity",1+gap/warpSize);
             prev=true;
        }else{
             if($(this).index()==lastIndex)return;
             $(this).css(Gesture,gap);
             $(this).next().css("opacity",gap/warpSize);
             //$(this).prev().css("opacity",1+gap/warpSize);
             prev=true;
        }
    }).delegate("div","touchend",function(){

        if(gap<silderScale||$(this).index()==lastIndex){
            ToggleAn($(this));
        }else{
            ToggleAnNextPage($(this));
            $(this).next().css("opacity",1);
            return;
        }
        if(gap<silderScale&&prev){
            ToggleAn($(this).prev());
            prev=false;
        }else{
            ToggleAnNextPage($(this).prev());
            $(this).css("opacity",1);
        }
 
    });
function ToggleAn(obj){
    if(Direction){
        obj.animate({"top":'0'},100); 
    }else{
        obj.animate({"left":'0'},100); 
    }
}
function ToggleAnNextPage(obj){
    if(Direction){
        obj.animate({"top":warpSize},100); 
    }else{
        obj.animate({"left":warpSize},100); 
    }
}
return this;
}; 
// $.fn.slider.defaults = {
//         direction: 'left' //'h' 纵向,'v' 横向
//         // scale: 0.3,  //拖动超过多少百分比后才翻页
//         // itemSelector: 'div', //子元素选择器
//         //onMoveEnd: function(index){ //滑动结束后事件
//             //console.log(index);
// }
})(Zepto);