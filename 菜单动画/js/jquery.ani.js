(function($){
    $.fn.ani = function(options){
		var defaults = {
			otype:"Buffer",
			fns:function(){}
		}
        var options = $.extend(defaults, options);
        this.each(function(){
 		var _this=$(this);
 		if(options.otype=="Buffer"){
 			miaovDoMoveBuffer($(this));
 		}
 		if(options.otype=="Flex"){
 			_this.timer=setInterval(function(){
 				miaovDoMoveFlex(_this);
 			},15);
 		}
function miaovDoMoveBuffer(obj){
	  clearInterval(obj.timer);
	  var oBstop=true;
		obj.timer=setInterval(function(){
			for(arrt in options){
				var iWidth=null;

						if(arrt=='opacity'){
								iWidth=parseInt(parseFloat(obj.css(arrt))*100);
							}else
							{
								iWidth=parseInt(obj.css(arrt));
							}
						document.title=isNaN(iWidth);
						if(isNaN(iWidth))
						{
							continue;
						}else{
							var iSpeed=(options[arrt]-iWidth)/8;
							iSpeed=iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);
							if(iWidth!=options[arrt])
							{
									oBstop=false;//±íÊ¾»¹ÓÐÔªËØ¶¯»­Ã»Ö´ÐÐÍê
							}else{
									oBstop=true;
							}
							if(arrt=='opacity')
							{
								obj.css("filter","alpha(opacity:"+ (iWidth+iSpeed) +")");
								obj.css("opacity",(iWidth+iSpeed)/100);
							}else{
								obj.css(arrt,iWidth+iSpeed);
							}	


						}
			}
					if(oBstop)
					{
							clearInterval(obj.timer);
							if(options.fns!=null)
							{
								options.fns();
							}
					}
		},30); 
}
function miaovDoMoveFlex(obj){
	var bStop=true;
	var attr='';
	var speed=0;
	var cur=0;
	
	for(attr in options)
	{
		if(!obj.oSpeed)obj.oSpeed={};
		if(!obj.oSpeed[attr])obj.oSpeed[attr]=0;
		cur=parseInt(obj.css(attr));
		if(Math.abs(options[attr]-cur)>1 || Math.abs(obj.oSpeed[attr])>1)
		{
			bStop=false;
			obj.oSpeed[attr]+=(options[attr]-cur)/5;
			obj.oSpeed[attr]*=0.7;
			var maxSpeed=65;
			if(Math.abs(obj.oSpeed[attr])>maxSpeed)
			{
				obj.oSpeed[attr]=obj.oSpeed[attr]>0?maxSpeed:-maxSpeed;
			}
			
			obj.css(attr, cur+obj.oSpeed[attr]);
		}

	}
	if(bStop)
	{
		clearInterval(obj.timer);
		obj.timer=null;
		if(options.fns!=null)
		{
			options.fns();
		}
	}
}
        

  	});
  };
})(jQuery);