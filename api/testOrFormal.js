var locurl = window.location.host;
var csOrzs = '';
// if (locurl == 'mob.thmart.com.cn') {
	csOrzs = 'http://api.mall.thatsmags.com';
// } else {
// 	csOrzs = 'http://proj7.thatsmags.com';
// }

var csOrzs2 = csOrzs.slice(7,csOrzs.length);
// 设置token
setToken ();
function setToken () {
	var token = getQueryString('token') || "";
	if (token) {
		localStorage.setItem("token",token);
	}
}
// 设置goole统计
setGooleCount ();

function setGooleCount () {
	var str = $("<script async src='https://www.googletagmanager.com/gtag/js?id=UA-119695512-1'></script><script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'UA-119695512-1');</script>");  
	$("head").append(str);
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