// JavaScript Document

function GetStyle(obj,arrt){
	if(obj.currentStyle){
			return obj.currentStyle[arrt];
		}else{
			return getComputedStyle(obj,false)[arrt];
		}
	}
function StartMove(obj,josn,fn){
		clearInterval(obj.timer);
		var oBstop=true;
		obj.timer=setInterval(function(){
			for(arrt in josn){
				var iWidth=null;
					if(arrt=='opacity'){
						
						iWidth=parseInt(parseFloat(GetStyle(obj,arrt))*100);
						//alert(obj.currentStyle[arrt]);
						}else
						{
							iWidth=parseInt(GetStyle(obj,arrt));
							}
					
					var iSpeed=(josn[arrt]-iWidth)/8;
					iSpeed=iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);
					
					if(iWidth!=josn[arrt]){
							oBstop=false;//��ʾ����Ԫ�ض���ûִ����
						}
							if(arrt=='opacity')
								{
								obj.style.filter="alpha(opacity:"+ (iWidth+iSpeed) +")";
								obj.style.opacity=(iWidth+iSpeed)/100;
								}else{
								obj.style[arrt]=iWidth+iSpeed+'px';
								}		
			}
					if(oBstop)//�ж��Ƿ񶯻�ȫ������
					{
							clearInterval(obj.timer);
							if(fn)
							{
								fn();
							}
					}
		},30); 
	
	}