(function($, app, T) {
  app.WalkPage = app.PullPage.extend({
    getInitUrl: function() {
      var url = 'cities/cq/shops';
      return app.apiUrl(url);
    },
    addEventForShopTap: function() {
      var  self = this;
      $(this.options['itemsContainerId']).on('tap', 'article', function() {
        var shopIndex = parseInt(this.id.split(':')[1]);
        var item = self.data[shopIndex];
        var targetView = plus.webview.getWebviewById('plus/merchant');
        targetView.show();
        $.fire(targetView, 'pageEnter', {shop: item});
      });
    },
    preload: function() {
      // 预加载商铺界面
      $.preload({
        id: 'plus/merchant',
        url: '/plus/merchant.html'
      });
    },
    plusReady: function() {
      this.preload();
      this.startPullDown();
      this.addEventForShopTap();
    },
    itemsFragment: function(items, idStart) {
      return T.createRowBasedFragment(items, T.cardShopTemplate, idStart);
    }
  });
})(mui, window.app, window.app.Template);

//(function($, doc, T) {
//var hasMore = false;
//var apiUrl = defaultUrl = 'cities/cq/shops';
//
//$('.mui-scroll-wrapper').scroll();
//
//function configureMeta(meta) {
//  if (meta && meta.links && meta.links.next) {
//    hasMore = true;
//    apiUrl = meta.links.next;
//  } else {
//    hasMore = false;
//    apiUrl = defaultUrl;
//  }
//}
//
//// 清除店铺列表
//function clearShopList() {
//  var plist = document.getElementById('plist');
//  while(plist.firstElementChild) {
//    plist.removeChild(plist.firstElementChild);
//  }
//  window.ShopData = {};
//}
//
////添加店铺列表
//function appendShops(shops) {
//  var plist = document.getElementById('plist');
//  for(var i = 0; i < shops.length; i++) {
//    window.ShopData[shops[i].id] = shops[i];
//  }
//  plist.appendChild(T.createRowBasedFregment(shops, T.cardShopTemplate));
//}
//
//// 刷新商铺
//function pullDownRefresh() {
//  console.log('refresh shops');
//  var shops = null;
//  $.ajax({
//    url: window.app.apiUrl(apiUrl),
//    success: function(data) {
//      shops = data.shops;
//      clearShopList();
//      appendShops(shops);
//      shops = null;
//      //是否能下拉加载
//      configureMeta(data.meta);
//      mui('#refreshContainer').pullRefresh().refresh(hasMore);
//    },
//    complete: function() {
//      mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
//    }
//  });
//}
//
////下拉加载
//function pullUpRefresh() {
//  console.log('pull more shops:' + hasMore);
//  if(!hasMore) {
//    mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
//  }
//  var shops = null;
//  $.ajax({
//    url: window.app.apiUrl(apiUrl),
//    success: function(data) {
//      shops = data.shops;
//      clearShopList();
//      appendShops(shops);
//      shops = null;
//      //是否能下拉加载
//      configureMeta(data.meta);
//    },
//    complete: function() {
//      mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
//    }
//  }); 
//}
//
//function addEventForShopItem() {
//  $('#plist').on('tap', 'article', function() {
//    console.log('tap on', this.id);
//    var targetView = plus.webview.getWebviewById('plus/merchant');
//    targetView.show();
//    var shopId = parseInt((this.id.split(':')[1]));
//    $.fire(targetView, 'shopEnter', {shop: window.ShopData[shopId]});
//  });
//}
//
//$.plusReady(function(){
//  $.init({
//    pullRefresh: {
//      container: "#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
//      down: {
//        contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
//        contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
//        contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
//        callback : pullDownRefresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
//      },
//      up: {
//        contentrefresh: "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
//        contentnomore: '没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
//        callback: pullUpRefresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
//      }
//    }
//  });
//  // 预加载商铺界面
//  targetView = $.preload({
//    id: 'plus/merchant',
//    url: '/plus/merchant.html'
//  });
//  
//  //首次进入触发下拉刷新
//  $('#refreshContainer').pullRefresh().pulldownLoading();
//  addEventForShopItem();
//  // 隐藏滚动条
//  plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
//})
//})(mui, document, window.app.Template)

