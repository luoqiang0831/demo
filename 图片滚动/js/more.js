// JavaScript Document

function GetStyle(obj,arrt){
	if(obj.currentStyle){
			return obj.currentStyle[arrt];
		}else{
			return getComputedStyle(obj,false)[arrt];
		}
	}
function StartMove(obj,arrt,iTarget){
		clearInterval(obj.timer);
		obj.timer=setInterval(function(){
					var iWidth=null;
					if(arrt=='opacity'){
						
						iWidth=parseInt(parseFloat(GetStyle(obj,arrt))*100);
						//alert(obj.currentStyle[arrt]);
						}else
						{
							iWidth=parseInt(GetStyle(obj,arrt));
							}
					
					var iSpeed=(iTarget-iWidth)/8;
					iSpeed=iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);
					if(iWidth==iTarget){
							clearInterval(obj.timer);
						}else{
							if(arrt=='opacity')
								{
								obj.style.filter="alpha(opacity:"+ (iWidth+iSpeed) +")";
								obj.style.opacity=(iWidth+iSpeed)/100;
								}else{
								obj.style[arrt]=iWidth+iSpeed+'px';
									}
							}
								   },30); 
	
	}