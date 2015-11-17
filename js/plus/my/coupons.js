(function($, app, T){
  app.UserCouponsPage = app.PullPage.extend({
    plusReady: function() {
      this.startPullDown();
      this.addEventForUseCoupon();
    },
    getInitUrl: function() {
      return 'user/coupons';
    },
    itemsFragment: function(items, idStart) {
      return T.createRowBasedFragment(items, T.userCouponTemplate, idStart)
    },
    addEventForUseCoupon: function() {
      var self = this;
      $('#plist').on('tap', '.collect.danger .type', function() {
        var index = this.id.split('=')[1]
        $.openWindow({
          url: '/plus/qcode.html',
          waiting: {
            autoShow: false 
          }
          extras: {
            userCoupon: self.data[index]
          }
        });
      })
    }
  });
})(mui, window.app, window.app.Template);
