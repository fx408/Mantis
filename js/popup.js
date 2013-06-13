function showList() {
	
	// 显示列表
	this.show = function(data, preUrl) {
		html = "";
		
		for(var i =0; i < data.length; i++) {
			if(!data[i].title.text) continue;
			
			html += '<h4><a href="javascript:;" class="bugTitle">'+data[i].title.text+' (<span>'+data[i].list.length+'</span>)</a></h4>';
			html += this.createHtml(data[i].list, preUrl);
		}
		
		$("#topicList").html(html);
	}
	
	// 生成HTML
	this.createHtml = function(data, preUrl) {
		var html = '<div class="tab-pane active" style="display:none">'
			+ '<table class="table table-hover">';
		for(var k in data) {
			if(!/^\w+\:\/\//.test(data[k].url)) data[k].url = preUrl+"/"+data[k].url;
			
			html += '<tr><td>'
				+ '<a href="'+data[k].url+'" target="_blank">'+data[k].content+'</a>'
				+ '</td></tr>';
		}
		
		return html+'</table></div>';
	}
	
}

var SL = new showList;

$(function() {
	var url = LDB.item("mantis_address");
	if(url == null) {
		$("#topicList").html(_LANGUAGE.setAddress);
	} else {
		APP.request(url, {
			callback: function(err, data) {
				if(false != err) return false;
				url = url.match(/(.*?)\/\/([^\/]+)\//);
				SL.show(data, url[1]+"//"+url[2]);
			},
			isString: true
		});
	}
	
	$("#topicList").on("click", "a.bugTitle", function() {
		var n = $(this).find("span").html()*1;
		
		if(n > 0) $(this).parent().next().slideToggle();
		return false;
	});
});