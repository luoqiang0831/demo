(function(window,undefined){
  var hasTouch=("createTouch" in document) || ('ontouchstart' in window),
  parseArgs=function(b,a){
    for(var key in a){
      if(typeof a[key]=='undefined'){
        b[key]=a[key]
      }
    }
    return b;
  },
  children=function(elem){
    var children=elem.children||elem.childNodes,_ret=[],i=0;
    for(;i<children.length;i++){
      if(children[i].nodeType===1){
        _ret.push(children[i])
      }
    }
    return _ret;
  },
  each=function(arr,func){
    var i=0,j=arr.length;
    for(;i<j;i++){
      if(func.call(arr[i],i,arr[i])===false){
        break;
      }
    }
  },
  GetCss=function(obj){
    var _ret='{',style=obj.style.cssText.split(";"),i=0,re=/\s/g;
    if(style[0]=="")return eval('({"top":"0","left":"0"})');
    for(;i<style.length-1;i++){
      var  q=style[i].split(":")
      _ret+='"'+q[0]+'":"'+q[1]+'",'
    }
    _ret=_ret.substring(0,_ret.length-1).replace(re,'')
    _ret+='}'
    return eval('(' + _ret + ')');
  },
  GetPrint=function(e){
    var print=[],x=hasTouch?e.touches[0]:e;
      print[0]={'pagex':x.pageX,'pagey':x.pageY,'offsetx':x.offsetX,'offsety':x.offsetY};
    return print;
  },
  Intercept=function(id,cfg){
    if(!id.nodeType){
      id=document.getElementById(id)
    }
    this.cfg=parseArgs(cfg||{},this._default);
    this.element=id;
    if(this.element){
      this.container=this.element.parentNode||document.body;
      this.setup();
    }
  }
Intercept.fn=Intercept.prototype={
  version:'1.0.0',
  _default:{
    'id':'wrapper',//默认ID
    'height':'300',//默认高度
    'width':'300',//默认宽度
    'drag':true,//是否拖拽
    'before':new Function,//拖动前执行
    'after':new Function  //拖动后执行
  },
  //初始化
  setup:function(){
     var Touch=hasTouch||!this._default.drag,
     startEvent=Touch ? "touchstart" : "mousedown",
     moveEvent=Touch ? "touchmove" : "mousemove",
     endEvent=Touch ? "touchend" : "mouseup";

    this.imgs=children(this.element)[0];
    this.cfg.height=parseInt(this.cfg.height);
    this.cfg.width=parseInt(this.cfg.width);
    this.touching=!!hasTouch;
    this.xs=false;

    if(this.imgs.length<=0)return 

    //this.addListener(this.element,startEvent,this.bind(this._start,this),false)
    this.addListener(this.imgs,startEvent,this.bind(this._start,this),false)
    this.addListener(this.imgs,moveEvent,this.bind(this._move,this),false)
    this.addListener(this.imgs,endEvent,this.bind(this._end,this),false)
  },
  addListener:function(e,n,o,u){
    if(e.addEventListener){
      e.addEventListener(n,o,u);
      return  true;
    }else if(e.attachEvent){
      e.attachEvent('on'+n,o);
      return true;
    }
    return false;
  },
  bind:function(func,obj){
    return function(){
      return func.apply(obj,arguments);
    }
  },
  _start:function(e){
    // var x=even.changedTouches||even;
    // debugger
    // console.log(x.pageX);
    //var startPrint=this.GetPrint(e),OneThouchX=startPrint[0].pagex,OneThouchY=startPrint[0].pagey
    this.xs=true;
    this.startPrint=GetPrint(e)
    this.disX=this.startPrint[0].pagex;
    this.disY=this.startPrint[0].pagey;
    this.position=GetCss(this.imgs);
    
  },
  _move:function(e){
  
    if(!this.xs)return

    this.movePrint=GetPrint(e);
    var l=(this.movePrint[0].pagex-this.disX)+parseInt(this.position.left);
    var t=(this.movePrint[0].pagey-this.disY)+parseInt(this.position.top);
    if(t<-(this.imgs.offsetHeight-this.element.offsetHeight) || t>0 ||l>0 || l<-(this.imgs.offsetWidth-this.element.offsetWidth))
      {

      }else{
        this.imgs.style.top=t+'px';
        this.imgs.style.left=l+'px';
      }
    
    this.stopDefault(e)

  },
  _end:function(e){
    this.xs=false;
    this.GetInfo()
  },
  GetInfo:function(){
    var position=GetCss(this.imgs),re=/\D/g;
    console.log('{"ImgWidth":"'+this.imgs.offsetWidth+'","ImgHeight":"'+this.imgs.offsetHeight+'","ConWidth":"'+this.element.offsetWidth+'","ConHeight":"'+this.element.offsetHeight+'","X":"'+position.left.replace(re,'')+'","Y":"'+position.top.replace(re,'')+'"}');
    this.sendAjaxRequest({
      url:'http://www.baidu.com/asp.cy',
      type:'get',
      data:{"ImgWidth":""+this.imgs.offsetWidth+"","ImgHeight":""+this.imgs.offsetHeight+"","ConWidth":""+this.element.offsetWidth+"","ConHeight":""+this.element.offsetHeight+"","X":""+position.left.replace(re,'')+"","Y":""+position.top.replace(re,'')+""},
      success:function(data){
        alert(data)
      }
    });
  },
  stopDefault:function(e) { 
      //阻止默认浏览器动作(W3C) 
      if ( e && e.preventDefault ) 
          e.preventDefault(); 
      //IE中阻止函数器默认动作的方式 
      else
          window.event.returnValue = false; 
      return false; 
  },
  _createXMLHttpRequest:function() { 
    var XMLHttpReq=null;
      try {  
          XMLHttpReq = new ActiveXObject("Msxml2.XMLHTTP");//IE高版本创建XMLHTTP  
      }  
      catch(E) {  
          try {  
              XMLHttpReq = new ActiveXObject("Microsoft.XMLHTTP");//IE低版本创建XMLHTTP  
          }  
          catch(E) {  
              XMLHttpReq = new XMLHttpRequest();//兼容非IE浏览器，直接创建XMLHTTP对象  
          }  
      }
      return XMLHttpReq;
  },
  sendAjaxRequest:function(obj) {  
    try{
        if(!this.XMLHttpReq)
        {
          this.XMLHttpReq=this._createXMLHttpRequest();   //创建XMLHttpRequest对象
          }
          var opt='';
          for(var j in obj.data){
          opt+=j+'='+obj.data[j]+'&'
        }
        opt=opt.substring(0,opt.length-1)
        this.XMLHttpReq.onreadystatechange = this._processResponse(obj.success); //指定响应函数  
        if(obj.type.toLowerCase()=='post')  
          {
            this.XMLHttpReq.open("post", obj.url, true);
            this.XMLHttpReq.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            this.XMLHttpReq.send(opt); 

          }else{
            var urlOpt=obj.url+"?"+opt;
            this.XMLHttpReq.open("get",urlOpt, true);
            this.XMLHttpReq.send(null); 
          } 

    }catch(e){
      console.log("AJAX Error:"+e);
    }
     
  },//回调函数  
  _processResponse:function(fn) {  
      if (this.XMLHttpReq.readyState == 4) {  
          if (this.XMLHttpReq.status == 200) {  
            fn(this.XMLHttpReq.responseText) 
          }else{
            console.log("数据返回错误！");
          }
      }  
  
  }  



}
window.Intercept=Intercept;
})(window)