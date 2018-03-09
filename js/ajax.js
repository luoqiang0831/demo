// JavaScript Document

function ajax(url,fnSucc,fnFaild){
	var oAjax=null;
	//IE6
	if(window.XMLHttpRequest){//为什么要加window因为加了之后会返回	undefined不然IE6下面会说找不到XMLHttpRequest。很有用的兼容解决方法
				oAjax=new XMLHttpRequest();
			}else{
				oAjax=new ActiveXobject("Microsoft.XMLHTTP");
			}
			oAjax.open('GET',url,true);
			oAjax.send();
			
			oAjax.onreadystatechange=function(){
				if(oAjax.readyState==4){
					
					if(oAjax.status==200){
						fnSucc(oAjax.responseText);
						}
						else
						{
							if(fnFaild!=null){
								fnFaild();
							}
						}
					}
				};
	}