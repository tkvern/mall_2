/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/
(function($, owner) {
	/**
	 * 用户登录
	 **/
	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.account = loginInfo.account || '';
		loginInfo.password = loginInfo.password || '';
		if (loginInfo.account.length < 11) {
			return callback('账号最短为 11 个字符');
		}
		if (loginInfo.password.length < 6) {
			return callback('密码最短为 6 个字符');
		}
		
		//连接服务器验证账号密码
		var users = JSON.parse(localStorage.getItem(loginInfo.account) || '[]');
		var authed = users.some(function(user) {
			return loginInfo.account == user.account && loginInfo.password == user.password;
		});
		if (authed) {
			return owner.createState(loginInfo.account, callback);
		} else {
			return callback('用户名或密码错误');
		}
	};

	owner.createState = function(name, callback) {
		var state = owner.getState();
		state.account = name;
		state.token = "token123456789";
		owner.setState(state);
		return callback();
	};

	/**
	 * 新用户注册
	 **/
	owner.reg = function(regInfo, callback) {
		callback = callback || $.noop;
		regInfo = regInfo || {};
		regInfo.account = regInfo.account || '';
		regInfo.password = regInfo.password || '';
		regInfo.verifyCode = regInfo.verifyCode || '';
		if (regInfo.account.length < 11) {
			return callback('手机号最短需要 11 个字符');
		}
		if (regInfo.password.length < 6) {
			return callback('密码最短需要 6 个字符');
		}
		if (regInfo.verifyCode != "123456") {
			return callback('请输入验证码: 123456');
		}
		
		//连接服务器验证账号密码
		var users = JSON.parse(localStorage.getItem(regInfo.account) || '[]');
		var authed = users.some(function(user) {
			return regInfo.account == user.account;
		});
		if (!authed) {
			users.push(regInfo);
			localStorage.setItem(regInfo.account, JSON.stringify(users));
			return callback();
		} else {
			return callback('手机号已被注册');
		}
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
		//var settings = owner.getSettings();
		//settings.gestures = '';
		//owner.setSettings(settings);
	};

	var checkAccount = function(account) {
		account = account || '';
		return (account.length >= 11);
	};

	/**
	 * 找回密码
	 **/
	owner.forgetPassword = function(account, callback) {
		callback = callback || $.noop;
		if (!checkAccount(account)) {
			return callback('手机号码不合法');
		}
		$.openWindow({
			url: 'reset_password.html',
			id: account,
			show: {
				aniShow: 'pop-in'
			},
			styles: {
				popGesture: 'hide'
			},
			waiting: {
				autoShow: false
			}
		});
		//此处调用服务器API发送验证码
		return callback(null, '验证码：123456 \n已经发送到您的手机，请查收。');
	};
		
	/**
	 * 重置密码
	 **/
	owner.resetPassword = function(resetInfo, callback){
		callback = callback || $.noop;
		resetInfo = resetInfo || {};
		resetInfo.account = resetInfo.account || '';
		resetInfo.password = resetInfo.password || '';
		resetInfo.verifyCode = resetInfo.verifyCode || '';
		if (resetInfo.account.length < 11) {
			return callback('手机号出现错误');
		}
		if (resetInfo.password.length < 6) {
			return callback('密码最短需要 6 个字符');
		}
		if (resetInfo.verifyCode != "123456") {
			return callback('请输入验证码: 123456');
		}
		//连接服务器做修改同时验证API返回的验证码
		return callback();
	}

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