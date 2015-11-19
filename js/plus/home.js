(function($, app, T){
  app.HomePage = app.PullPage.extend({
    getInitUrl: function() {
      return app.apiUrl('cities/cq/malls');
    },
    plusReady: function() {
//    this.preload();
      this.startPullDown();
      this.addEventForMallTap();
    }, 
    preload: function() {
      if(plus.webview.getWebviewById('plus/grap')) {
        return;
      }
      $.preload({
        url: '/plus/grap.html',
        id: 'grap'
      })
    },
    addEventForMallTap: function() {
      var self = this;
      $(this.options['itemsContainerId']).on('tap', 'article', function(e) {
        var targetUrl = this.id;
        var dataIndex = this.getAttribute('data-index');
        var _item = self.data[parseInt(dataIndex)];
        console.log('====' + targetUrl);
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
    itemsFragment: function(items, idStart) {
      console.log('index start:', idStart);
      return T.createRowBasedFragment(items, T.cardMallTemplate, idStart);
    }
  });
})(mui, window.app, window.app.Template);