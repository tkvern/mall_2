(function($, app, T){
  app.UserCouponsPage = app.PullPage.extend({
    plusReady: function() {
      this.startPullDown();
    },
    getInitUrl: function() {
      return 'user/coupons';
    },
    itemsFragment: function(items, idStart) {
      return T.createRowBasedFragment(items, T.userCouponTemplate, idStart)
    }
  });
})(mui, window.app, window.app.Template);
