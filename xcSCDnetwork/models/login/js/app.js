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
		var pass = hex_md5(loginInfo.password);
		console.log("ip:" + loginInfo.dstHttp);
		console.log("user:" + loginInfo.account + " pass:" + loginInfo.password + " md5" + pass);
		/*
		if (loginInfo.account.length < 5) {
			return callback('账号最短为 5 个字符');
		}
		if (loginInfo.password.length < 6) {
			return callback('密码最短为 6 个字符');
		}
		var users = JSON.parse(localStorage.getItem('$users') || '[]');
		var authed = users.some(function(user) {
			return loginInfo.account == user.account && loginInfo.password == user.password;
		});*/
		var res = "";
		mui.ajax(loginInfo.dstHttp,{
			data:{
				Action:'GetConfig'
			},//发送到服务器的业务数据
			dataType:'json',//服务器返回json格式数据
			type:'get',//HTTP请求类型
			async: false,//异步请求
			timeout:3000,//超时时间设置为3s
			headers:{'Content-Type':'application/json', 
				'Username':loginInfo.account, 
				'Password': pass},
				//指定app请求的header
				//请求成功时触发的回调函数
			success:function(data){//
				console.log("data" + JSON.stringify(data));
				owner.setConfig(data);
				res = "x";
				console.log("data.Success=" + data.Success);
				if(data.Success == false)
				{
					res = "";
				}
			}
		});
		
		if (res == "x") {
			console.log("logon OK!~" + loginInfo.account);
			return owner.createState(loginInfo.account, pass, loginInfo.dstHttp, callback);
		} else {
			return callback('用户名或密码错误');
		}
	};

	owner.createState = function(name, pass, http,callback) {
		var state = owner.getState();
		state.account = name;
		state.token = pass;
		state.ip = http;
		owner.setState(state);
		return callback();
	};



	owner.SetConfig = function(subId, cnf, callback){
		var state = owner.getState();
		var username = state.account || "";
		var password = state.token || "";
		var dstIP = state.ip || "";
		var res = "";
		console.log("usr" + username + " ps:"+password + " dst:" + dstIP);
		mui.ajax(dstIP,{
			data:{
				Action:"SetConfig",
				SubAreaID: subId,
				Cnf:cnf
			},
			dataType:'json',//服务器返回json格式数据
			type:'get',//HTTP请求类型
			async: false,
			timeout:3000,
			headers:{'Content-Type':'application/json', 
				'Username': username, 
				'Password': password},
			success:function(data){
				console.log("data" + JSON.stringify(data));
	
				return callback(data);
			}
		});
		
	};
	/**
	 * 新用户注册
	 **/
	owner.reg = function(regInfo, callback) {
		callback = callback || $.noop;
		regInfo = regInfo || {};
		regInfo.account = regInfo.account || '';
		regInfo.password = regInfo.password || '';
		if (regInfo.account.length < 5) {
			return callback('用户名最短需要 5 个字符');
		}
		if (regInfo.password.length < 6) {
			return callback('密码最短需要 6 个字符');
		}
		if (!checkEmail(regInfo.email)) {
			return callback('邮箱地址不合法');
		}
		var users = JSON.parse(localStorage.getItem('$users') || '[]');
		users.push(regInfo);
		localStorage.setItem('$users', JSON.stringify(users));
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
		//var settings = owner.getSettings();
		//settings.gestures = '';
		//owner.setSettings(settings);
	};

	var checkEmail = function(email) {
		email = email || '';
		return (email.length > 3 && email.indexOf('@') > -1);
	};

	/**
	 * 找回密码
	 **/
	owner.forgetPassword = function(email, callback) {
		callback = callback || $.noop;
		if (!checkEmail(email)) {
			return callback('邮箱地址不合法');
		}
		return callback(null, '新的随机密码已经发送到您的邮箱，请查收邮件。');
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
	
		/**
	 * 获取应用本地配置
	 **/
	owner.setIP = function(settings, callback) {
		settings = settings || "d1.nirain.com:10187";
		localStorage.setItem('$IP', settings);
		
		return callback("设置成功，请返回！");
	}
	
		/**
	 * 获取应用本地配置
	 **/
	owner.getIP = function() {
		var settingsText = localStorage.getItem('$IP') || "d1.nirain.com:10187";
		return settingsText;
	}
	

	owner.getConfig = function() {
		var confJson = localStorage.getItem('$xcConfig') || "{}";
		return JSON.parse(confJson);
	};

	owner.setConfig = function(cnf) {
		cnf = cnf || {};
		localStorage.setItem('$xcConfig', JSON.stringify(cnf));
		//var settings = owner.getSettings();
		//settings.gestures = '';
		//owner.setSettings(settings);
	};
}(mui, window.app = {}));