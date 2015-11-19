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
    afterLoading: function() {
      if(this.data.length < 1) {
        var content = document.getElementById('plist');
        content.innerHTML = "<p class='text-center'>还没有优惠劵,赶紧去逛逛吧</p>"
      }
    },
    addEventForUseCoupon: function() {
      var self = this;
      $('#plist').on('tap', '.collect.danger .type', function() {
        var index = parseInt(this.id.split(':')[1]);
        console.log('index:', index);
        $.openWindow({
          url: '/plus/qcode.html',
          waiting: {
            autoShow: true
          },
          extras: {
            userCoupon: self.data[index]
          }
        });
      })
    }
  });
})(mui, window.app, window.app.Template);
