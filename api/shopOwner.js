(function(mui) {
    mui.init();
    var shopId = getQueryString("merchantsid") || 1;


    
    $('a').on('click',function() {
        window.location.href = $(this).attr("href");
    })
    // shopSrc ('#shopHomePage','./shopOwner-home.html',shopId);
    shopSrc ('#shopAllPage','./shop-product-list.html',shopId,'&flag=1');
    shopSrc ('#shopNewPage','./shop-product-list.html',shopId,'&flag=2');
    shopSrc ('#shopCategory','./shop-category.html',shopId);
    getPageData ();
    fixedBanner ();
    CollectionBtn ();

    // 获取页面数据
    function getPageData () {
        var token = window.localStorage.getItem('token') || null;
        console.log(token)
        $.ajax({
            url: csOrzs + '/Api/Merchant/getDetail',
            type: 'POST',
            data: {id:shopId,token:token}
        })
        .done(function(data) {
            console.log(data);
            var shopDetailsData = data;
            if (shopDetailsData.code == 1 ) {
                $('#shopLogo').attr("src",shopDetailsData.data.coverpic);
                $('#shopName').text(shopDetailsData.data.merchant_name);
                $('title').text(shopDetailsData.data.merchant_name);
                var bannerArr = shopDetailsData.data.figure;
                var shopBannerList2 = {"shopBannerList":bannerArr};
                var shopBannerHtml = template('shopBanner', shopBannerList2);
                $('#shopBannerBox').html(shopBannerHtml);
                shopBannerCarousel();
                var contentArr = shopDetailsData.data.content;
                var shopProductsList2 = {"shopProductsList":contentArr};
                var contentArrHtml = template('shopProducts', shopProductsList2);
                $('#productBox').html(contentArrHtml);
                imgLazyLoad();
                var param = shopDetailsData.data.param;
                var scriptInsert = "<script type='text/javascript' src='https://webchat.7moor.com/javascripts/7moorInit.js?accessId="+ param +"&autoShow=false&language=ZHCN' async='async'></script>";
                $("body").append($(scriptInsert));
                if (shopDetailsData.data.collect == 1) {
                    $(".iconfont.icon-shoucang").addClass('icon-shoucang1');
                }
            } else {
                mui.toast("Network error, please try again!");
            }
        })
        .fail(function() {
            mui.toast("Network error, please try again!");
        });
    }

    function shopSrc (element,src,id,flag) {
        $(element).attr("href", src +'?merchantsid='+ id + flag);
    }

    

    // 图片懒加载
    function imgLazyLoad() {
        $("img.lazy").lazyload({ 
            effect : "fadeIn",
            threshold: 1500,
            placeholder: "http://api.mall.thatsmags.com/Public/ckfinder/images/grey.jpg"
        }); 
    }
    

    // 调用轮播图
    function shopBannerCarousel() {
        var homeBannerCarousel = new Swiper('.home-banner-carousel',{
          loop: true,
          autoplay: 4000,
          speed: 1000,
          autoplayDisableOnInteraction: false,
          pagination : '.swiper-pagination',
          paginationClickable :true       
        });
    }
    // 固定导航栏
    function fixedBanner() {
        var $window = $(window),
            $mainMenuBar = $('#mainMenuBar'),
            $mainMenuBarAnchor = $('#mainMenuBarAnchor');
            
        $window.scroll(function() {
            var window_top = $window.scrollTop();
            var div_top = $mainMenuBarAnchor.offset().top;
            console.log(div_top);
            if (window_top > div_top) {
                $mainMenuBar.addClass('stick');
                $mainMenuBarAnchor.height($mainMenuBar.height());
            }else {
                $mainMenuBar.removeClass('stick');
                $mainMenuBarAnchor.height(0);
            }
        });
    }
    
    // 收藏按钮
    function CollectionBtn() {
        $(".icon-shoucang").click(function(){
            $(".icon-shoucang").toggleClass("icon-shoucang1");
            if ($(".icon-shoucang").hasClass('icon-shoucang1')) {
                Collection (1,shopId,2,"Successfully!");
            } else {
                Collection (0,shopId,2,"Save failed!");
            }
        });
    }
    // 收藏共用
    function Collection (isnot,id,shoporpro,info) {

        var token = window.localStorage.getItem('token');
        $.ajax({
            beforeSend: function(request) {
                request.setRequestHeader("TOKEN", token);
            },
            url: csOrzs + '/Api/Collect/userCollect',
            type: 'POST',
            data: {
                status: isnot,
                content_id: id,
                content_type: shoporpro,
                },
            })
            .done(function(data) {
                console.log(data);
                if (data.code == 1) {
                    mui.toast(info);
                } else {
                    window.location.href = './login.html';
                }
        })
        .fail(function() {
            mui.toast("Network error, please try again!");
        })    
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


    wechatShare ();
    // 微信分享
    function wechatShare () {
        var url = window.location.href;
        $.ajax({
            url: csOrzs + '/Api/Wx/wxShare',
            type: 'POST',
            async: false,
            data: {merchant_id: shopId, url: encodeURI(encodeURI(url))}
        })
        .done(function(data) {
            console.log(data);
            share (data.data);
        }).fail(function() {
            mui.toast("Network error, please try again!");
        });
        
    }

    function share (data) {
        wx.config({
        debug:false,// 是否开启调试模式
        appId:data.signPackage.appId,// 必填，微信号AppID
        timestamp:String(data.signPackage.timestamp),// 必填，生成签名的时间戳
        nonceStr:data.signPackage.nonceStr,// 必填，生成签名的随机串
        signature:data.signPackage.signature,// 必填，签名，见附录1
        jsApiList:['onMenuShareTimeline',//分享到朋友圈
                 'onMenuShareAppMessage',//分享给朋友
                 'onMenuShareQQ'//分享到QQ
                ]// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(function(){
            var options ={
                title:data.res.title,// 分享标题
                link:encodeURI(data.signPackage.url),// 分享链接，记得使用绝对路径
                imgUrl:encodeURI(data.res.imgUrl),// 分享图标，记得使用绝对路径
                desc:data.res.desc,// 分享描述
                success:function(){
                  console.info('分享成功!'); 
                  // 用户确认分享后执行的回调函数
                },
                cancel:function(){
                  console.info('取消分享！2');
                  // 用户取消分享后执行的回调函数
                }
            }
            wx.onMenuShareTimeline(options);// 分享到朋友圈
            wx.onMenuShareAppMessage(options);// 分享给朋友
            wx.onMenuShareQQ(options);// 分享到QQ
            
        }); 
    }
})(mui);