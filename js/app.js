var QUERY = 'puppies';

function ChromeExtensionApp() {
	this.error = false;
	
	this.callback = function(){}; // 回掉函数
	
	this.cookieCache = '';
	// 表单数据
  this.formData = function(data) {
  	var fd = new FormData();
  	for(var k in data) {
  		fd.append(k, data[k]);
  	}
  	return fd;
  }
  
  // 读取cookies
  this.cookies = function() {
  	var _this = this;
  	
  	chrome.cookies.getAll({}, function(cookies) {
  		var cookieString = '';
  		for(var k in cookies) {
  			cookieString += cookies[k].name+"="+cookies[k].value+"; ";
  		}
  		_this.cookieCache = cookieString;
  	});
  	return this.cookieCache;
  }
  
  // 请求数据
  this.request = function(url, params) {
  	this.callback = params.callback || function() {};
  	data = params.data || {};
  	
  	var _this = this,
  		requestType = params.isPost ? "POST" : "GET";
  	
    var req = new XMLHttpRequest();
    req.open(requestType, url, true);
    req.onload = this.afterRequest.bind(this);
    req.onerror = function() {
    	console.log("--error--");
    	console.log(arguments);
    };
    
    req.send(this.formData(data));
  }

	// 请求成功 回调
	this.afterRequest = function(e) {
		var res = e.target.response,
			returnData = [];

		$(res).find("table.hide table").each(function() {
			var temp = {
				title:{url:"", text:""},
				list: []
			};
			
			$(this).find("tr").each(function(n) {
				if(n == 0) {
					temp.title.url = $(this).find("a:eq(0)").attr("href");
					temp.title.text = $(this).find("a:eq(0)").html();
				} else {
					var t = {id:"",url:"",content: ""}
					t.id = $(this).find("td:eq(0)").find("a:eq(0)").html();
					t.url = $(this).find("td:eq(0)").find("a:eq(0)").attr("href");
					t.content = $.trim( $(this).find("td:eq(1) span").html() );
					
					temp.list.push(t);
				}
			});
			returnData.push(temp);
		});
		
		console.log(returnData);
		error = false;
  	if(typeof this.callback == "function") this.callback(error, returnData);
  }
}

var APP = new ChromeExtensionApp();
//APP.cookies();