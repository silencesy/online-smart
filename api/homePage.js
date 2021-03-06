(function(mui) {
	var page = 0;
	var lazyLoad;
	// 首页上拉加载更多热销商品
	mui.init({
		pullRefresh: {
			container: '#homepage',
			up: {
				auto:true,
				contentrefresh : "Loading…",
				callback: pullupRefresh
			}
		}
	});
	// 上拉记载回调函数
	function pullupRefresh() {
		page ++;
		$.ajax({
			url: csOrzs + '/Api/Set/getList',
			type: 'GET',
			data: {
				set_position: '12',
				pageSize: '9',
				p: page
			},
		})
		.done(function(data) {
			console.log(data);
			if (data.code == 1) {
				var totalPages = data.data.totalPages;
				var goods = data.data.goods;
				var hotProductList2 = {"hotProductList":goods};
				var goodsHtml = template('hotProduct', hotProductList2);
				$('#hotProductbox').append(goodsHtml);
				$("#hotProductbox li .mui-media-body").addClass('line2');
				imgLazyLoad();
				mui('#homepage').pullRefresh().endPullupToRefresh((page == totalPages || totalPages == 0));
				if (page == totalPages || totalPages == 0) {
					$('.mui-pull-bottom-pocket').addClass('hide');
				}
			} else {
				mui.toast("Network error, please try again!");
			}
		})
		.fail(function() {
			mui.toast("Network error, please try again!");
		});
		
	}
	// 显示和隐藏返回按钮
	document.querySelector('.mui-scroll-wrapper' ).addEventListener('scroll', function (e) { 
		var top = e.detail.y;
		// 搜索栏渐变
	    var searchBox = document.querySelector('#searchBg');
	    var height = -280;
        var opacity = 0;
        if(top < height){
            opacity = 0.95;
        }
        else{
            opacity = 0.95 * (top/height);
        }
        searchBox.style.background = "rgba(246,67,44,"+opacity+")";
		
      	if (e.detail.y < -280) {
      		$('.iconfont.icon-fanhuidingbu').show();
      	} else {
      		$('.iconfont.icon-fanhuidingbu').hide();
      	}
    });
    // 返回顶部
    mui("body").on('tap', '#backBtn', function(event){
		mui('.mui-scroll-wrapper').pullRefresh().scrollTo(0, 0, 300);
	});
	mui(".mui-content").on('tap', 'a', function(event){
		window.location.href = $(this).attr('href');
	});

	mui.ready(function() {

		getAllDate ();
		// 标记 如果只有一张轮播图则不循环轮播
		var isloop;
		// 数据获取
		function getAllDate () {
			$.ajax({
				url: csOrzs +  '/Api/Public/home',
				type: 'POST',
				dataType: 'json'
			})
			.done(function(data) {
				var homeData = data;
				console.log(homeData);
				if (data.code==1) {
					// 首页轮播
					var figures = homeData.data.figure;
					if (figures.length == 1) {
						isloop = false;
					} else {
						isloop = true;
					}
					var homeBannerList2 = {"homeBannerList":figures};
					var homeBannerHtml = template('homeBanner', homeBannerList2);
					$('#homeBannerbox').html(homeBannerHtml);
					homeBannerFunction();
					// deals
					var deals = homeData.data.deal;
						deals.goPage = "http://mob.thmart.com.cn/coupons.html?couponid=18";
						deals.carouselName = "dealcarousel";
					var dealsList2 = {"dealsList":deals};
					var dealsHtml = template('deals', dealsList2);
					$('#dealsbox').html(dealsHtml);
					console.log(1);
					// floorCarousel("."+deals.carouselName,deals.list.length,"./product-list.html?categoryid=17");
					floorCarousel("."+deals.carouselName,deals.list.length,"http://mob.thmart.com.cn/coupons.html?couponid=18");
					// ticketing
					var ticketing = homeData.data.ticketing;
					var ticketing2 = {"ticketingList":ticketing};
					var ticketingHtml = template('ticketing', ticketing2);
					$('#ticketingbox').html(ticketingHtml);
					floorCarousel("#ticketingCarousel",ticketing.list.length,"./all-categorys.html?categoryid=1");
					// article
					var article = homeData.data.article;
					var articleList2 = {"articleList":article};
					var articleHtml = template('article', articleList2);
					$('#articlebox').html(articleHtml);
					// feature_products
					var feature_products = homeData.data.feature_products;
					var productList2 = {"productList":feature_products};
					var featureProductsHtml = template('featureProducts', productList2);
					$('#featureProductsbox').html(featureProductsHtml);
					floorCarousel("#featureProductsCarousel",feature_products.list.length,"./all-categorys.html?categoryid=30");
					// 家电
					var dispatcher = homeData.data.dispatcher;
						dispatcher.goPage = "./product-list.html?categoryid=34";
						dispatcher.carouselName = "dispatchercarousel";
					var dispatcher2 = {"dealsList":dispatcher};
					var dispatcherHtml = template('deals', dispatcher2);
					$('#dispatcherBox').html(dispatcherHtml);
					floorCarousel("."+dispatcher.carouselName,dispatcher.list.length,"./product-list.html?categoryid=34");
					// shop
					var feature_shop = homeData.data.feature_shop;
					var shopList2 = {"shopList":feature_shop};
					var shopHtml = template('shop', shopList2);
					$('#shopbox').html(shopHtml);
					floorCarousel("#shopCarousel",feature_shop.list.length,"./shop-list.html");
					// homeware
					var houseware = homeData.data.houseware;
						houseware.goPage = "./all-categorys.html?categoryid=19";
						houseware.carouselName = "housewarecarousel";
					var houseware2 = {"dealsList":houseware};
					var housewareHtml = template('deals', houseware2);
					$('#homeWare').html(housewareHtml);
					floorCarousel("."+houseware.carouselName,houseware.list.length,"./all-categorys.html?categoryid=19");
					// babyProducts
					var motherandbaby = homeData.data.motherandbaby;
						motherandbaby.goPage = "./all-categorys.html?categoryid=16";
						motherandbaby.carouselName = "motherandbabycarousel";
					var motherandbaby2 = {"dealsList":motherandbaby};
					var motherandbabyHtml = template('deals', motherandbaby2);
					$('#babyProducts').html(motherandbabyHtml);
					floorCarousel("."+motherandbaby.carouselName,motherandbaby.list.length,"./all-categorys.html?categoryid=16");
					// Toys
					var toys = homeData.data.toys;
						toys.goPage = "./all-categorys.html?categoryid=31";
						toys.carouselName = "toyscarousel";
					var toys2 = {"dealsList":toys};
					var toysHtml = template('deals', toys2);
					$('#Toys').html(toysHtml);
					floorCarousel("."+toys.carouselName,toys.list.length,"./all-categorys.html?categoryid=31");
					// conpons
					var conpons = homeData.data.coupon;
						conpons.goPage = "./all-categorys.html?categoryid=2";
						conpons.carouselName = "conponscarousel";
					var conpons2 = {"dealsList":conpons};
					var conponsHtml = template('deals', conpons2);
					$('#conpons').html(conponsHtml);
					floorCarousel("."+conpons.carouselName,conpons.list.length,"./all-categorys.html?categoryid=2");
					// electRonics
					var electrical = homeData.data.electrical;
						electrical.goPage = "./all-categorys.html?categoryid=6";
						electrical.carouselName = "electricalcarousel";
					var electrical2 = {"dealsList":electrical};
					var electricalHtml = template('deals', electrical2);
					$('#electRonics').html(electricalHtml);
					floorCarousel("."+electrical.carouselName,electrical.list.length,"./all-categorys.html?categoryid=11");
					
					$('#hotTitileimg').attr("src",homeData.data.hot_products.image);
					// 两行显示点点点
					$('.home-floor-section .home-pick-info p').addClass('line2');
					$('.home-product-carousel-box .product-lists p').addClass('line2');
					// 广告1
					var ads = homeData.data.ads;
					if (ads.length!=0) {
						adFlag(0);
						adFlag(1);
						adFlag(2);
					}
					function adFlag(index) {
						if (ads[index].ad_cat_id == 1) {
							var ad1 = 	'<a href="./product-detail.html?productid='+ ads[index].ad_id +'">'
								+'<img class="lazy" src="'+ ads[index].ad_img +'" alt="" />'
								+'</a>'
							$('#homeId'+ (index+1)).html(ad1);
						} else if (ads[index].ad_cat_id == 2) {
							var ad2 = 	'<a href="./shopOwner-home.html?merchantsid='+ ads[index].ad_id +'">'
								+'<img class="lazy" src="'+ ads[0].ad_img +'" alt="" />'
								+'</a>'
							$('#homeId'+ (index+1)).html(ad2);
						} else {
							var ad3 = 	'<a href="'+ads[index].ad_url+'">'
								+'<img class="lazy" src="'+ ads[index].ad_img +'" alt="" />'
								+'</a>'
							$('#homeId'+ (index+1)).html(ad3);
						}
					}
					// // 页面加载完毕遮罩层消失
					$('.layer-box').remove();
					$('#homePageShow').css("visibility","block");
					imgLazyLoad();
				} else {
					mui.toast("Network error, please try again!");
				}
				
			})
			.fail(function() {
				mui.toast("Network error, please try again!");
			});
		}
		

		// 楼层滑块轮播
		function floorCarousel(dom,length,url) {
			var slidesPerView;
			if (length<4) {
				slidesPerView = 3;
			} else {
				slidesPerView = 3.2;
			}
			console.log(slidesPerView);
			new Swiper(dom,{
		        scrollbar: '.swiper-scrollbar',
		        scrollbarHide: true,
		        slidesPerView: 'auto',
		        freeMode : true,
		        spaceBetween: 8,
		        slidesPerView: slidesPerView,
	      		slidesPerColumn: 1,
		        grabCursor: true,
			   	onTouchEnd: function(swiper){
			   		var translate = swiper.translate;
			   		var LengthTips = swiper.width - swiper.virtualSize - 50;
					if(translate<LengthTips){ 
						location.href = url; 
					}
				}
			});
		}
		
		//首页banner轮播
	    function homeBannerFunction () {
	    	var homeBannerCarousel = new Swiper('.home-banner-carousel',{
				loop: isloop,
				autoplay: 4000,
				speed: 300,
				autoplayDisableOnInteraction: false,
				pagination : '.swiper-pagination',
				paginationClickable :true				
			});
	    }
		//搜索
		var userPicker = new mui.PopPicker();
		userPicker.setData([{
			value: 'All',
			text: 'All'
		},{
			value: 'Shops',
			text: 'Shops'
		}, {
			value: 'Deals',
			text: 'Deals'
		}, {
			value: 'Ticketing',
			text: 'Ticketing'
		}, {
			value: 'Coupons',
			text: 'Coupons'
		}]);
		// 搜索下拉选选择
		var showUserPickerButton = document.getElementById('showUserPicker');
		showUserPickerButton.addEventListener('tap', function(event) {
			userPicker.show(function(items) {
				showUserPickerButton.innerHTML = items[0].text + '<i class="iconfont icon-xiangshangjiantou-copy-copy-copy fr"></i>';
				$(showUserPickerButton).attr('value',items[0].text);
			});
		}, false);
		// 点击搜索图标按钮 首页搜索
		$('.iconfont.icon-sousuo').on("click",function(){
			goSearch ();
		});
		// 点击键盘按钮 首页搜索
		$('#homeSearch').submit(function(e){
			goSearch ();
		});
		// 搜索回调函数
		function goSearch () {
			$('#searchInput').blur();
	  		var searchText = $('#searchInput').val();
			if (searchText=='') {
				$('#searchInput').blur();
				mui.toast("Please enter keywords!");
			} else {
				if ($(showUserPickerButton).attr('value')=='Shops') {
					window.location.href = './search-result.html?searchdata='+ searchText;
				} else if ($(showUserPickerButton).attr('value')=='Deals'){
					window.location.href = './search-all.html?searchdata=' + searchText + '&flag=' + 1;
				} else if ($(showUserPickerButton).attr('value')=='Ticketing'){
					window.location.href = './search-all.html?searchdata=' + searchText + '&flag=' + 3;
				} else if ($(showUserPickerButton).attr('value')=='Coupons'){
					window.location.href = './search-all.html?searchdata=' + searchText + '&flag=' + 4;
				} else {
					window.location.href = './search-all.html?searchdata=' + searchText + '&flag=' + 0;
				}
			}		
		}

		wechatShare ();
		// 微信分享
		function wechatShare () {
			var url = window.location.href;
			$.ajax({
				url: csOrzs + '/Api/Wx/wxShare',
				type: 'POST',
				async: false,
				data: {goods_id: "", url: encodeURI(encodeURI(url))}
			})
			.done(function(data) {
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
		


	});
	// 图片懒加载
    function imgLazyLoad() {
        $("img.lazy").lazyload({ 
            effect : "show",
            threshold: 10000,
            placeholder: "http://api.mall.thatsmags.com/Public/ckfinder/images/grey.jpg"
        }); 
    }
})(mui);