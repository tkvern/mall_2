/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/
(function($, owner) {
  owner.Template = {};
  
	$.plusReady(function(){
		console.log("webview ["+ plus.webview.currentWebview().id + "] count: ", plus.webview.all().length);
	});
	
	owner.BASEURL = 'http://192.168.1.16:8080/api/v1/';
	/**
	 *  基础功能
	 */
	owner.jumpToLoginWindow = function() {
		$.openWindow({
			id: 'login',
			url: '/login.html',
			show: {
				aniShow: 'pop-in'
			},
			waiting: {
				autoShow: false
			},
			preloadPages:[{
				url: "/plus/home.html",
			  	id: "home",
				waiting: {
					autoShow: false
				}
			}]
		});
	}
	
	/*
	 * ajax 调用地址
	 */
	owner.apiUrl = function(uri) {
	  if(uri.startsWith('http://') || uri.startsWith('https://')) {
	     return uri; 
	  } else if(uri.startsWith('/')) {
			uri = uri.slice(1);
		}
		return owner.BASEURL + uri;
	}
	
	/*
	 * 登录信息存储
	 */
	owner.rememberLoginUser = function(token, user) {
		localStorage.setItem("accessToken", token);
		localStorage.setItem("currentUser", JSON.stringify(user));
		//记录最后登录的手机号
		localStorage.setItem("lastMobile", user.mobile);
		console.log('记录登录信息');
	}
	
	/*
	 * 检查当前用户是否登录
	 */
	owner.isLogin = function() {
		return !!owner.getAccessToken();
	}
	
	/*
	 * 获取token
	 */
	owner.getAccessToken = function() {
		return localStorage.getItem("accessToken");
	}
	
	/*
	 * 获取最后登录人的手机号
	 */
	owner.getLastMobile = function() {
		return localStorage.getItem("lastMobile") || '';
	}
	
	/*
	 * 清除登录相关信息
	 */
	owner.clearLoginInfo = function() {
		localStorage.removeItem("accessToken");
		localStorage.removeItem("currentUser");
		console.log('删除登录信息');
	}
	
	/*
	 * 获取当前登录用户
	 */
	owner.getCurrentUser = function() {
		var item = localStorage.getItem("currentUser")
		if(item) {
			return JSON.parse(item);
		}
		return null;
	}
	
	owner.loginTest = function(name,callback) {
		//游客测试
		//连接服务器验证账号密码 同时设置缓存
		return owner.createState(name,callback);
	};

	owner.createState = function(name, callback) {
		var state = owner.getState();
		state.account = name;
		state.token = "token123456789";
		owner.setState(state);
		return callback();
	};

	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
		var settings = owner.getSettings();
		settings.gestures = '';
		owner.setSettings(settings);
	};

		
	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
		var settingsText = localStorage.getItem('$settings') || "{}";
		return JSON.parse(settingsText);
	}
	
}(mui, window.app = {}));