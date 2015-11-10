(function($, app, T){
  app.UserCouponsPage = app.PullPage.extend({
    plusReady: function() {
      this.startPullDown();
    },
    getInitUrl: function() {
      return 'user/coupons';
    },
    itemsFregment: function(items, idStart) {
      return T.createRowBasedFregment(items, T.userCouponTemplate, idStart)
    }
  });
})(mui, window.app, window.app.Template);
