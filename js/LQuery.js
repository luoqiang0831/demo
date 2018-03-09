// JavaScript Document
function $(vArg){
	return new LQuery(vArg);
}
//一个元素绑定多个事件
function myAddEvent(obj,sEv,fn){
	if(obj.attachEvent){
		obj.attachEvent('on'+sEv,function(){
			//阻止默认事件
			if(false==fn.call(obj)){
				//阻止冒泡
				event.cancelBubble=true;
				return false;
				}
			});
	}else
	{
		obj.addEventListener(sEv,function(ev){							  
			//阻止默认事件
			if(false==fn.call(obj)){
				ev.cancelBubble=true;
				ev.preventDefault();
			}
		},false);
	
		
	}
		
	}
//获取class列表
function GetClassItem(parent,nClass){
	var oitem=parent.getElementsByTagName('*');
	var arr=[];
	for(var i=0; i<oitem.length;i++){
		if(oitem[i].className==nClass)
			arr.push(oitem[i]);
		}
	return arr;
	};
//获取样式属性值
function GetStyle(obj,attr){
	var re=/\D\D$/;
	if(obj.currentStyle){
		return (obj.currentStyle[attr]).replace(re,'');
	}else
	{
		return (getComputedStyle(obj,false)[attr]).replace(re,'');
	}
}
//数组转换
function arrTransform(arr1,arr2){
	for(var i=0;i<arr2.length;i++){
		arr1.push(arr2[i]);
		
		}
	return arr1;
	}
//获取索引值
function getIndex(obj){
	var ochildren=obj.parentNode.children;
	for(var i=0;i<ochildren.length;i++){
		if(obj==ochildren[i]){
			return i;
			}
		}
	}
function LQuery(vArg){
	this.elements=[];
	switch(typeof vArg){
		case 'function':
			myAddEvent(window,'load',vArg);
		break;
		case 'string':
			switch(vArg.charAt(0)){
				case '#':
					this.elements.push(document.getElementById(vArg.substring(1)));
				break;
				case '.':
					this.elements=GetClassItem(document,vArg.substring(1));
				break;
				default:
					this.elements=document.getElementsByTagName(vArg);
				}
		break;
		case 'object':
		this.elements.push(vArg);

		}
};
LQuery.prototype.click=function(fn){
	var i=0;
	for(i=0; i<this.elements.length;i++){
			myAddEvent(this.elements[i],'click',fn);
		}
	return this;
};
LQuery.prototype.show=function(){
	var i=0;
	for(i=0; i<this.elements.length;i++){
			this.elements[i].style.display="block";
		}
	return this;
};
LQuery.prototype.hide=function(){
	var i=0;
	for(i=0; i<this.elements.length;i++){
			this.elements[i].style.display="none";
		}
	return this;
};
LQuery.prototype.hover=function(vOver,vOut){
	var i=0;
	for(i=0; i<this.elements.length;i++){
			myAddEvent(this.elements[i],'mouseover',vOver);
			myAddEvent(this.elements[i],'mouseout',vOut);
		}
	return this;
};
LQuery.prototype.css=function(attr,value){
	if(arguments.length==2){
		
		for(var i=0; i<this.elements.length;i++){
			
			this.elements[i].style[attr]=value;
		}
	}else
	{
			//return GetStyle(this.elements[0],attr);
			switch(typeof attr){
				case 'string':
					return GetStyle(this.elements[0],attr);
				break;
				case 'object':
					var j='';
					for(var i=0;i<this.elements.length;i++){
							for(j in attr){
								this.elements[i].style[j]=attr[j];
							}
					}
				break;
				
			}
	}
	return this;
	
};

LQuery.prototype.toggle=function(){
	
	var _arguments=arguments;
		
		for(var i=0; i<this.elements.length;i++){
			eventCount(this.elements[i]);
		}

	function eventCount(obj){
		var count=0;
		myAddEvent(obj,'click',function(){
				_arguments[count++%_arguments.length].call(obj);		
			});
		}
	return this;
};
LQuery.prototype.attr=function(attr,value){
		if(arguments.length==2){
		
			for(var i=0; i<this.elements.length;i++){
					this.elements[i][attr]=value;
				}
		 }
		 else
		 {	
			return this.elements[0][attr];
	   	}
};
LQuery.prototype.eq=function(n){
		return $(this.elements[n]);
	}
LQuery.prototype.find=function(findData){
	
		var oResult=[];
		
		for(var i=0;i<this.elements.length;i++){
			 switch(findData.charAt(0)){
				 case '.':
					 var arr=GetClassItem(this.elements[i],findData.substring(1));
					 oResult=oResult.concat(arr);
				 break;
				 default:
					 var arr=this.elements[i].getElementsByTagName(findData);
					 //这里得到的是元素节点 不能直接连接到数组 需转换
					 arrTransform(oResult,arr);
				 
				 }
			
			}
		var newLQuery=$();
		newLQuery.elements=oResult;
		return newLQuery;
};

LQuery.prototype.index=function(){
		return getIndex(this.elements[0]);
	};
LQuery.prototype.bind=function(sEv,fn){
		for(var i=0;i<this.elements.length;i++){
			myAddEvent(this.elements[i],sEv,fn);
		}
		return this;
	};

LQuery.prototype.size=function(){
		return this.elements.length;
	};
LQuery.prototype.animate=function(json,fn){					  
	for(var i=0;i<this.elements.length;i++){
		StartMove(this.elements[i],json,fn);
	}
	function GetStyle(obj,arrt){
	var re=/\D\D$/;
	if(obj.currentStyle){
			return (obj.currentStyle[arrt]).replace(re,'');
		}else{
			return (getComputedStyle(obj,false)[arrt]).replace(re,'');
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
								oBstop=false;//表示还有元素动画没执行完
							}
						 if(arrt=='opacity')
						  {
							obj.style.filter="alpha(opacity:"+ (iWidth+iSpeed) +")";
							obj.style.opacity=(iWidth+iSpeed)/100;
						   }else{
							
							obj.style[arrt]=iWidth+iSpeed+'px';
						 }		
						}
					if(oBstop)//判断是否动画全部到达
					{
							clearInterval(obj.timer);
							if(fn)
							{
								fn();
							}
					}
			},30); 
	
		}
};

LQuery.prototype.MoveObj=function(){
	
		for(var i=0;i<this.elements.length;i++){
			objClick(this.elements[i]);
		}
		function objClick(obj){
			
			obj.onmousedown=function(ev){	
				var oEvent=ev||event;
				var divMouseX=oEvent.clientX-obj.offsetLeft;//得到鼠标在DIV里面的坐标
				var divMouseY=oEvent.clientY-obj.offsetTop;

				document.onmousemove=function(ev){
						var oEvent=ev||event;
						var l=oEvent.clientX-divMouseX;
						var t=oEvent.clientY-divMouseY;
						if(l<0){
							l=0;
						}else if(l>document.documentElement.clientWidth-obj.offsetWidth){
							l=document.documentElement.clientWidth-obj.offsetWidth;
							}
						if(t<0){
							t=0;
							}else if(t>document.documentElement.clientHeight-obj.offsetHeight){
								t=document.documentElement.clientHeight-obj.offsetHeight;
								}
						obj.style.top=t+'px';
						obj.style.left=l+'px';
			
					};
				
					document.onmouseup=function(){
						document.onmousemove=null;
						document.onmouseup=null;
					};
					return false;
				};
		};
		
};
//碰撞检测
LQuery.prototype.Collision=function(obj1,obj2){
		var ol1=obj1.offsetLeft;
		var or1=obj1.offsetLeft+obj1.offsetWidth;
		var ot1=obj1.offsetTop;
		var ob1=obj1.offsetTop+obj1.offsetHeight;
		
		var ol2=obj2.offsetLeft;
		var or2=obj2.offsetLeft+obj2.offsetWidth;
		var ot2=obj2.offsetTop;
		var ob2=obj2.offsetTop+obj2.offsetHeight;
		//if(or1<ol2||ob1<ot2||or2<ol1||ob2<ot1)'
		
		if(or1<ol2||ol1>or2||ob1<ot2||ot1>ob2)
		{
			return false;
		}else{
			return true;
		}
};
//接口
LQuery.prototype.extend=function(name,fn){
		LQuery.prototype[name]=fn;
	};
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	