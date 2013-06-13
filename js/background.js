function _background() {
	var busy = false,
		testTimes = 0, // 繁忙尝试次数
		maxTestTime = 15, // 最大繁忙尝试次数
		dataList = {},
		_this = this;
	
	this.maxFrequency = 1500;
	this.minFrequency = 100;
	this.defaults = {
		frequency: 600,
		time: 10
	};
	
	// 请求数据
	function request() {
		if(busy) return false;
		busy = true;
		
		var url = LDB.item("mantis_address");
		if(url == null) return false;
		
		var params = {
			callback: function(err, data) {
				if(false != err) return false;
				_this.dataList = data;
				
				var c = _this.count(data);
				c = c ? (c > 10 ? '10+' : c.toString()) : "0";
				
				_this.updateIcon(c);
				busy = false;
			},
			isString: true
		};
		
		APP.request(url, params);
	}
	
	// 计算未读话题数量
	this.count = function(data) {
		return data[0].list.length;
	}
	
	// 计算尝试次数
	function countTestTimes() {
		if(testTimes > maxTestTime) {
			testTimes = 0;
			busy = false;
			return false;
		}
		testTimes++;
	}
	
	// 更新图标
	this.updateIcon = function(string) {
		string = string.toString();
		
		chrome.browserAction.setIcon({path: "/images/icon.png"});
		chrome.browserAction.setBadgeBackgroundColor({color:[208, 0, 24, 255]});
		chrome.browserAction.setBadgeText({text: string});
	}
	
	this.refresh = function() {
		busy = false;
		this.run();
	}
	
	this.timeOutCache = {};
	this._setTimeout = function(func, time) {
		var _this = this;
		
		if(this.timeOutCache[func]) clearTimeout(this.timeOutCache[func]);
		this.timeOutCache[func] = setTimeout(function() {
			_this[func]();
		}, time*1000);
	}
	
	// 运行
	this.run = function() {
		var auto = LDB.item('autoCheck');
		
		if(auto === 0 || busy == true) {
			this._setTimeout("run", this.defaults.time);
			countTestTimes();
			return false;
		}
		
		var frequency = LDB.item("frequency") || this.defaults.frequency;;
		frequency = Math.max(this.minFrequency, Math.min(parseInt(frequency), this.maxFrequency));
		
		this._setTimeout("run", frequency);
		console.log("runrunrun");
		request();
	}
}

var BK = new _background();

var isRun = false;
function initHandle () {
	console.log("initHandle");
	console.log(arguments);
	console.log("isRun: "+isRun);
	if(!isRun) {
		console.log("App running!");
		isRun = true;
		BK.run();
	}
}
function alarmHandle(alarm) {
	initHandle();
}

chrome.runtime.onInstalled.addListener(initHandle);
chrome.alarms.onAlarm.addListener(alarmHandle);
chrome.windows.onCreated.addListener(initHandle);
chrome.webNavigation.onDOMContentLoaded.addListener(initHandle);