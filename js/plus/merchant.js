(function($, app, T) {
  var MerchantPage = app.PullPage.extend({
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
        document.getElementById('brand').innerHTML = T.brandShopTemplate(self.currentItem);
        $(self.options['pullRefreshContainerId']).pullRefresh().pulldownLoading();       
      });
    },
    addEventForCouponGrap: function() {
      mui('#coupon-list').on('tap', '.collect.danger .type', function(event) {
        console.log(this.innerHTML);
        var couponId = this.id.split(':')[1];
        plus.nativeUI.showWaiting('抢劵中');
        $.ajax({
          url: app.apiUrl('coupons/' + couponId + '/grab'),
          type: 'POST',
          success: function(data) {
            plus.nativeUI.closeWaiting();
            plus.nativeUI.toast(data.message || data.error, {duration: 'long'});
          },
          error: function() {
            plus.nativeUI.closeWaiting();
          }
        });
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
