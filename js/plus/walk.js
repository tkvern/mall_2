(function($, app, T) {
  app.WalkPage = app.PullPage.extend({
    getInitUrl: function() {
      var url = 'cities/cq/shops?size=5';
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



