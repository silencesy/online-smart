(function(mui) {
	mui.init();
	bottomhightlight ();
	goWeixinLogin();
	var webAddrwexin;
	// $('#wechatlogin').attr('href','http://page.thatsmags.com/WebAccess/get-weixin-code.html?appid=wx06e97f4ed4ac07e3&scope=snsapi_userinfo&state=STATE&redirect_uri=http%3A%2F%2F' + csOrzs2 + '%2FApi%2FAccount%2FthirdLogin');
	$('#wechatLogin').on('click',function() {
		window.location.href = 'http://page.thatsmags.com/WebAccess/get-weixin-code.html?appid=wx06e97f4ed4ac07e3&scope=snsapi_userinfo&state=' + webAddrwexin + '&redirect_uri=http%3A%2F%2F' + csOrzs2 + '%2FApi%2FAccount%2FthirdLogin'
	});

	$('#goRegistered').on('click',function() {
		window.location.href = "../register-phone.html?state=" + webAddrwexin;
	});
	var loginBtn = document.getElementById('loginBtn');
	// 登录
	loginBtn.addEventListener('tap',function(){
		var phoneNumber = document.getElementById('phoneNumber').value;
		var password = document.getElementById('password').value;
		var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
		if (!phoneNumber) {
			mui.toast('Please enter your number!');
			return false;
		} else if (!(/^1[345789]\d{9}$/.test(phoneNumber))) {
			mui.toast("Please enter a 11-digit valid number!");
			return false;
		} else if ( password == '') {
			mui.toast("Please enter your password!");
			return false;
		} else if (!reg.test(password)) {
			mui.toast("Please enter your password with 6-16 digits (must contain numbers and letters)!",{ duration:'long', type:'div' });
			return false;
		}
		
		$.ajax({
			url: csOrzs + '/Api/Account/mbLogin',
			type: 'POST',
			dataType: 'json',
			data: {mobile: phoneNumber,password: password},
		})
		.done(function(data) {
			if (data.code == 1) {
				var token = data.data.token;
				localStorage.setItem("token",token);
				goBack ();
			} else if (data.code == 0) {
				mui.toast("The user does not exist!");

			} else if (data.code == -300){
				mui.toast("Incorrect password!");
			} else {
				mui.toast("Network error, please try again!");
			}
		})
		.fail(function() {
			mui.toast("Network error, please try again!");
		});

	});
	// 登录成功跳回原来的页面 123
	console.log(123123);
	function goBack () {
		var prevLink = document.referrer;
		var webAddr;
		if ( csOrzs == 'http://api.mall.thatsmags.com' || csOrzs == 'https://api.mall.thatsmags.com') {
			webAddr = 'https://mob.thmart.com.cn'; 
		} else if (csOrzs == 'http://proj7.thatsmags.com' || csOrzs == 'https://proj7.thatsmags.com') {
			webAddr = 'http://proj9.thatsmags.com';
		}  
		if($.trim(prevLink)==''){ 
			location.href = webAddr; 
		}else{  
		    if(prevLink.indexOf(webAddr)==-1){    //来自其它站点  
		        location.href = webAddr;  
		    } else if (prevLink == 'http://mob.thmart.com.cn/reset-password.html' || prevLink == 'https://mob.thmart.com.cn/reset-password.html') {
		    	location.href = 'https://mob.thmart.com.cn';
		    } else if (prevLink == 'http://proj9.thatsmags.com/reset-password.html') {
		    	location.href = 'http://proj9.thatsmags.com';
		    } else if (prevLink == 'http://mob.thmart.com.cn/personal-info.html' || prevLink == 'https://mob.thmart.com.cn/personal-info.html') {
		    	location.href = 'https://mob.thmart.com.cn';
		    } else if (prevLink == 'http://proj9.thatsmags.com/personal-info.html') {
		    	location.href = 'http://proj9.thatsmags.com';
		    } else{
		    	location.href = prevLink;
		    }
		      
		}
	}
	//微信登录跳回原来的页面
	function goWeixinLogin() {
		var prevLink = document.referrer;
		if(prevLink==''){ 
			if ( csOrzs == 'https://api.mall.thatsmags.com') {
				webAddrwexin = 'http://mob.thmart.com.cn'; 
			} else if (csOrzs == 'https://proj7.thatsmags.com') {
				webAddrwexin = 'http://proj9.thatsmags.com';
			}  
		// } else if (prevLink == 'https://proj9.thatsmags.com/personal-info.html') {
		// 	webAddrwexin = 'http://proj9.thatsmags.com';
		// } else if (prevLink == 'https://mob.thmart.com.cn/personal-info.html') {
		// 	webAddrwexin = 'http://mob.thmart.com.cn';
		// } else {  
		//     webAddrwexin = prevLink;  
		// }
		} else if (prevLink == 'http://mob.thmart.com.cn/reset-password.html') {
	    	webAddrwexin = 'http://mob.thmart.com.cn';
	    } else if (prevLink == 'http://proj9.thatsmags.com/reset-password.html') {
	    	webAddrwexin = 'http://proj9.thatsmags.com';
	    } else if (prevLink == 'http://mob.thmart.com.cn/personal-info.html') {
	    	webAddrwexin = 'http://mob.thmart.com.cn';
	    } else if (prevLink == 'http://proj9.thatsmags.com/personal-info.html') {
	    	webAddrwexin = 'http://proj9.thatsmags.com';
	    } else{
	    	webAddrwexin = prevLink;
	    }
		console.log(webAddrwexin)
	}

	// 获取页面高度
	// $('.layout-login').height($('body').height());
	// 获取地址栏参数
	function getQueryString(name) {
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		var r = window.location.search.substr(1).match(reg);
	if (r != null) {
		return unescape(r[2]);
	}
		return null;
	}
	// 底部高亮
	function bottomhightlight () {
		var flag = getQueryString("flag");
		if (flag == 'me') {
			$('#mePage').addClass('mui-active');
		} else if (flag == "cart") {
			$('#carPage').addClass('mui-active');
		}

	}
	is_weixn();
	// 是否是微信浏览器
	function is_weixn(){ 
	    var ua = navigator.userAgent.toLowerCase(); 
	    if(ua.match(/MicroMessenger/i)=="micromessenger") { 
	        return true; 
	    } else { 
	        $('.weixinLogin').hide();
	    } 
	}
})(mui);