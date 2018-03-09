$.fn.ajaxc = function(options){
	$(options.Masket).css("display","block")
	$.ajax({
		type:options.type,
		url:options.url,
		data:options.data,
		dataType:options.dataType,
		timeout:options.timeout,
		success:function(data){$(options.Masket).css("display","none");options.success(data)},
		error:function(data){$(options.Masket).css("display","none");options.error(data)},
		complete:options.complete
	})
}