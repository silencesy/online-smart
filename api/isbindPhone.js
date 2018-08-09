$(function(){
	var countdown=60;
	wechatBind ();
	getcode ();
	// 微信注册绑定
	function wechatBind () {
		mui('.login-btn').on('tap','#loginBtn',function(){
			var phoneNumber = document.getElementById('phoneNumber').value;
			var code = document.getElementById('code').value; 
			var openid = getQueryString("openid");
			var headimgurl = getQueryString("headimgurl");
			var sex = getQueryString("sex");
			var city = getQueryString("city");
			var goback = getQueryString("state");
			
			$('.home-mask input').each(function(index, el) {
				$(this).blur();
			});
			if (!phoneNumber) {
				mui.toast('Please enter your number!');
				return;
			} else if (!(/^1[345789]\d{9}$/.test(phoneNumber))) {
				mui.toast("Please enter a 11-digit valid number!");
				return;
			}
			if (!code) {
				mui.toast('Please enter your code!');
				return;
			}
			
			$.ajax({
				url: csOrzs + '/Api/Account/checkMobile',
				type: 'POST',
				dataType: 'json',
				data: {
					mobile: phoneNumber,
					code: code,					
					openid: openid,
					head_img: headimgurl,
					sex: sex,
					city: city
				},
			})
			.done(function(data) {
				console.log(data);
				if (data.code == 1) {
					var token = data.data.token;
					localStorage.setItem("token",token);
					window.location.href = goback;
				} else if (data.code == -2) {
					mui.toast("Incorrect verification code!");
				} else if (data.code == 2) {
					window.location.href = './login-info.html?mobile='+phoneNumber+'&openid='+openid+'&head_img='+headimgurl+'&sex='+sex+'&city='+city+'&state='+goback;
				} else {
					mui.toast("Network error, please try again!");
					return false;
				}
			})
			.fail(function() {
				mui.toast("Network error, please try again!");
			})
			
	   	});
	}
	function getcode () {
		getCode.addEventListener('tap',function(){
			var phoneNumber = document.getElementById('phoneNumber').value;
			var code = document.getElementById('code').value;
			if (!phoneNumber) {
				mui.toast('Please enter your number!');
				return;
			} else if (!(/^1[345789]\d{9}$/.test(phoneNumber))) {
				mui.toast("Please enter a 11-digit valid number!");
				return;
			}	
			settime(this);
			$.ajax({
				url: csOrzs + '/Api/Public/mobileCode',
				type: 'POST',
				dataType: 'json',
				data: {mobile: phoneNumber},
			})
			.done(function(data) {
				var data = data;
				if (data.data == 107) {
					mui.toast("Please enter a 11-digit valid number!");
					return false;
				}
				if (data.data == 109) {
					mui.toast("Frequent operation, please try again later!");
					return false;
				}
			})
			.fail(function() {
				mui.toast("Network error, please try again!");
			});
		});
	}
	// 短信获取倒计时
	function settime(obj) {   
		if (countdown == 0) {   
		    obj.removeAttribute("disabled");  
		    obj.style.backgroundColor = "#fc4002";  
		    obj.style.color = "#fff"; 
		    obj.innerText="Send code";   
		    countdown = 60;   
		    return;  
		} else {   
		    obj.setAttribute("disabled", true);
		    obj.style.backgroundColor = "#6A6A6A"; 
		    obj.style.color = "#fff";   
		    obj.innerText = countdown+ "s";   
		    countdown--;   
		}   
		setTimeout(function() {   
		    settime(obj);
		},1000);
	} 
	// 获取地址栏参数
	function getQueryString(name) {
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
			var r = window.location.search.substr(1).match(reg);
		if (r != null) {
			return unescape(r[2]);
		}
			return null;
	}
});