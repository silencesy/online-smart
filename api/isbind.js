$(function() {
	var mobile = getQueryString('mobile');
	var openid = getQueryString('openid');
	var head_img = getQueryString('head_img');
	var sex = getQueryString('sex');
	var city = getQueryString('city');
	var goback = getQueryString('state');
	wechatBind();
	// 微信注册绑定
	function wechatBind() {

		mui('#loginBtn')[0].addEventListener('tap', function() {
			var email = $.trim($("#emailtext1").val());
			var username = document.getElementById('name').value;
			var password = document.getElementById('password').value;
			var IncorrectPassword = document.getElementById('IncorrectPassword').value;
			var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
			$('.home-mask input').each(function(index, el) {
				$(this).blur();
			});
			if (!email) {
				mui.toast("Please enter your email address!");
				return false;
			} else if (!(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(email))) {
				mui.toast("Please enter a valid email address!");
				return false;
			}
			if (username == '') {
				mui.toast("Please enter your name!");
				return false;
			}
			if (password == '') {
				mui.toast("Please enter your password!");
				return false;
			} else if (!reg.test(password)) {
				mui.toast(" Please enter your password with 6-16 digits (must contain numbers and letters)!",{ duration:'long', type:'div' });
				return false;
			} else if (password!=IncorrectPassword) {
				mui.toast("The two passwords you entered do not match!");
				return false;
			}

			$.ajax({
					url: csOrzs + '/Api/Account/thirdBind',
					type: 'POST',
					dataType: 'json',
					data: {
						mobile: mobile,
						email: email,
						password: password,				
						openid: openid,
						username: username,
						head_img: head_img,
						sex: sex,
						city: city
					},
				})
				.done(function(data) {
					var data = data;
					var token = data.data.token;
					if (data.code == 1) {
						localStorage.setItem("token",token);
						window.location.href = goback;
					} else {
						mui.toast("Network error, please try again!");
					}
				})
				.fail(function() {
					mui.toast("Network error, please try again!");
				})

		});
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