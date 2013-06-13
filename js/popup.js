function showList() {
	
	// 显示列表
	this.show = function(data) {
		html = "";
		
		for(var i =0; i < data.length; i++) {
			if(!data[i].title.text) continue;
			
			html += '<h4><a href="javascript:;" class="bugTitle">'+data[i].title.text+' (<span>'+data[i].list.length+'</span>)</a></h4>';
			html += this.createHtml(data[i].list);
		}
		
		$("#topicList").html(html);
	}
	
	// 生成HTML
	this.createHtml = function(data) {
		
		var html = '<div class="tab-pane active" style="display:none">'
			+ '<table class="table table-hover">';
		for(var k in data) {
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
				SL.show(data);
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