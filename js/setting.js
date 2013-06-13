var setting = {
	mantisListKey: "mantis_list",
	mantisAddressKey: "mantis_address",
	maxKey: 0,
	
	// 显示列表
	showList: function() {
		var list = LDB.item(this.mantisListKey) || {},
			address = LDB.item(this.mantisAddressKey),
			html = "";
		
		for(var k in list) {
			var isUse = list[k].link == address,
				btnClass = isUse ? 'success disabled' : 'info',
				btnHtml = isUse ? _LANGUAGE.inUse : _LANGUAGE.use;
			
			html += '<tr><td><a href="'+list[k].link+'" target="_blank" title="'+list[k].link+'">'+list[k].name+'</a></td>'
				+ '<td><button type="button" class="btn btn-'+btnClass+'" mid="'+k+'">'+btnHtml+'</button>&nbsp;'
				+ '<button type="button" class="btn btn-danger" mid="'+k+'">'+_LANGUAGE.del+'</button></td></tr>';
			
			this.maxKey = k;
		}
		
		$("#mantisList tbody").html(html);
	},
	
	// 更新列表
	updateList: function(val) {
		var list = LDB.item(this.mantisListKey) || {},
			k = this.maxKey*1 + 1,
			reg = /^\w+\:\/\//;
		if(!reg.test(val.link)) val.link = "http://"+val.link;
		
		while(true) {
			if(list[k]) k++;
			else {
				list[k] = val;
				break;
			}
		}
		LDB.set(this.mantisListKey, list);
		this.showList();
		$("#addItem").hide();
	},
	
	// 更新监控地址
	updateAddress: function(mid) {
		var list = LDB.item(this.mantisListKey) || {};
		console.log(list[mid]);
		if(list[mid]) {
			LDB.set(this.mantisAddressKey, list[mid].link);
			
			try{
				chrome.extension.getBackgroundPage().BK.refresh();
			} catch(e) {
				console.log(e);
			}
		}
	},
	
	del: function(mid) {
		var list = LDB.item(this.mantisListKey) || {};
		if(list[mid]) delete list[mid];
		LDB.set(this.mantisListKey, list);
	}
}


$(function() {
	var mantisListKey = "mantis_list";
	
	$("#addItem button[name=add]").click(function() {
		var val = {
			name: $("#addItem input[name=mantisName]").val(),
			link: $("#addItem input[name=mantisLink]").val()
		};
		setting.updateList(val);
	});
	
	$("#addItem button[name=cancel]").click(function() {
		$("#addItem").hide();
	});
	
	$("#addItemLink").click(function() {
		$("#addItem").show();
	});
	
	$("#mantisList").on("click", ".btn-danger", function() {
		setting.del($(this).attr("mid"));
		setting.showList();
	})
	.on("click", ".btn-info", function() {
		setting.updateAddress($(this).attr("mid"));
		setting.showList();
	});
	
	setting.showList();
});