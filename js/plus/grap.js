(function($, app, T) {
  var GrapPage = app.PullPage.extend({
    getInitUrl: function() {
      return app.apiUrl('malls/' + this.currentItem.id + '/coupons');
    },
    itemsFragment: function(items, idStart) {
      return T.createRowBasedFragment(items, T.couponTemplate, idStart);
    },
    plusReady: function() {
      console.log('plusReady:', this.nextUrl);
      this.addEventForPageEnter();
      this.addEventForCouponGrap();
    },
    addEventForPageEnter: function() {
      var self = this;
      window.addEventListener('pageEnter', function(e) {
        console.log('grap page enter', JSON.stringify(e.detail));
        mall = e.detail.mall;
        if(self.currentItem && self.currentItem.id == mall.id) {
          return;
        }
        self.currentItem = mall;
        document.getElementById('brand').innerHTML = T.brandMallTemplate(self.currentItem);
        self.clearItems();
        $(self.options['pullRefreshContainerId']).pullRefresh().pulldownLoading();       
      });
    },
    addEventForCouponGrap: function() {
      mui('#post-list').on('tap', '.collect .type', function(event) {
        var elem = this;
        if(elem.innerText!="已抢" && elem.innerText!="未开始" && elem.innerText!="已抢完"){
          elem.className = elem.className.replace("badge-danger", "badge-success");
          var parent = elem.parentNode;
          parent.className = parent.className.replace("danger", "success");
          elem.innerText = "已抢";
          plus.nativeUI.toast('抢券成功！');
        }
      });
    },
    addEventForConcernOrUnconcern: function() {
      
    }
  });

  app.GrapPage = GrapPage;
})(mui, window.app, window.app.Template);

//(function($, T) {
////初始化单页的区域滚动
//var mall, hasMore = true;
//var apiUrl = defaultUrl = null;
//
//mui('.mui-scroll-wrapper').scroll();
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
//function clearCouponsList() {
//  var couponContainer = document.getElementById('coupon-list');
//  while (couponContainer.firstElementChild) {
//    couponContainer.removeChild(couponContainer.firstElementChild);
//  }
//}
//
//// 插入优惠劵
//function appendCoupons(coupons) {
//  fregment = T.createRowBasedFregment(coupons, T.couponTemplate);
//  document.getElementById('coupon-list').appendChild(fregment);
//}
//
//function pullDownRefresh() {
//  $.ajax({
//    url: window.app.apiUrl(apiUrl),
//    success: function(data) {
//      var coupons = data.coupons;
//      clearCouponsList();
//      appendCoupons(coupons);
//      configureMeta(data.meta);
//    },
//    complete: function() {
//      mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
//    }
//  });
//}
//
//function pullUpRefresh() {
//  // 没有更多数据了
//  if(!hasMore) {
//    mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
//    return ;
//  }
//  $.ajax({
//    url: window.app.apiUrl(apiUrl),
//    success: function(data) {
//      var coupons = data.coupons;
//      appendCoupons(coupons);
//      configureMeta(data.meta);
//    },
//    complete: function() {
//      mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);
//    }
//  });
//}
//
//mui.plusReady(function() {
//  var currentShop = null, refreshing = false;
//  mui.init({
//    pullRefresh: {
//      container: "#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
//      down: {
//        contentdown: "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
//        contentover: "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
//        contentrefresh: "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
//        callback: pullDownRefresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
//      },
//      up: {
//        contentrefresh: "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
//        contentnomore: '没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
//        callback: pullUpRefresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
//      }
//    }
//  });
//  
//  //点击进入事件
//  window.addEventListener('pageEnter', function(e){
//    console.log('mall enter', JSON.stringify(e.detail));
//    mall = e.detail.mall;
//    if(currentShop && currentShop.id != shop.id) {
//      return;
//    }
//    clearCouponsList();
//    apiUrl = defaultUrl = 'malls/' + mall.id + '/coupons';
//    mui('#refreshContainer').pullRefresh().pulldownLoading();
//  });
//
//  // 收藏
//  var heart = document.getElementById('heart');
//  heart.addEventListener('click', function(event){
//    if (heart.status == 0){
//      heart.status = 1;
//      heart.innerHTML = "<i class='fa fa-heart-o fa-2x'></i>";
//      plus.nativeUI.toast('已取消收藏！');
//    } else {
//      heart.status = 0;
//      heart.innerHTML = "<i class='fa fa-heart fa-2x'></i>";
//      plus.nativeUI.toast('收藏成功！');
//    }
//  });
//  //抢券
//  mui('#post-list').on('tap', '.collect .type', function(event) {
//    var elem = this;
//    if(elem.innerText!="已抢" && elem.innerText!="未开始" && elem.innerText!="已抢完"){
//      elem.className = elem.className.replace("badge-danger", "badge-success");
//      var parent = elem.parentNode;
//      parent.className = parent.className.replace("danger", "success");
//      elem.innerText = "已抢";
//      plus.nativeUI.toast('抢券成功！');
//    }
//  });
//});
//})(mui, window.app.Template);


