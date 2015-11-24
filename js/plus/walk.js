(function($, app, T) {
  app.WalkPage = app.PullPage.extend({
    getInitUrl: function() {
      var query = null;
      var pview = plus.webview.currentWebview().parent();
      if(pview && pview.query) {
        query = pview.query;
      }
      var url = 'cities/cq/shops?size=5';
      if(query) {
        url = url + '&q=' + encodeURIComponent(query);
      }
      return app.apiUrl(url);
    },
    addEventForShopTap: function() {
      var  self = this;
      $(this.options['itemsContainerId']).on('tap', 'article', function(e) {
        var targetUrl = this.id;
        var dataIndex = this.getAttribute('data-index');
        var _item = self.data[parseInt(dataIndex)];
        mui.openWindow({
          url: targetUrl,
          show: {
            aniShow: 'pop-in'
          },
          styles: {
            popGesture: 'hide'
          },
          waiting: {
            autoShow: true
          },
          extras: {
            item: _item
          }
        });
      });
    },
    plusReady: function() {
      this.addEventForShopTap();
    },
    itemsFragment: function(items, idStart) {
      return T.createRowBasedFragment(items, T.cardShopTemplate, idStart);
    }
  });
})(mui, window.app, window.app.Template);



