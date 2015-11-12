(function($, app, T) {
  var MerchantPage = app.PullWithTabPage.extend({
    getInitUrl: function() {
      return app.apiUrl('shops/' + this.currentItem.id + '/coupons');
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
        shop = e.detail.shop;
        if(self.currentItem && self.currentItem.id == shop.id) {
          return;
        }
        self.currentItem = shop;
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
      new window.app.GrapPage({
        'apiUrl': 'shops/1/coupons',
        'dataKey': 'coupons',
        'pullRefreshContainerId': '#refreshContainer',
        'itemsContainerId': '#coupon-list'
      }).start();
    }
  });

  app.MerchantPage = MerchantPage;
})(mui, window.app, window.app.Template);
