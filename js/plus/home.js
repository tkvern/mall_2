(function($, app, T){
  app.HomePage = app.PullPage.extend({
    getInitUrl: function() {
      return app.apiUrl('cities/cq/malls');
    },
    plusReady: function() {
      this.preload();
      this.startPullDown();
      this.addEventForMallTap();
    },
    pageReady: function() {
      this.addCityPicker();
    }, 
    preload: function() {
      $.preload({
        url: '/plus/grap.html',
        id: 'plus/grap'
      })
    },
    addEventForMallTap: function() {
      var self = this;
      $(this.options['itemsContainerId']).on('tap', 'article', function(e) {
        console.log('tap on', this.id);
        var targetView = plus.webview.getWebviewById('plus/grap');
        var mallId = parseInt(this.id.split(':')[1]);
        targetView.show();
        $.fire(targetView, 'pageEnter', {mall: self.data[mallId]});
      });
    },
    addCityPicker: function() {
      var cityPicker = new $.PopPicker();
      cityPicker.setData([{
        value: 'chongqing',
        text: '重庆'
      }]);
      //选择城市
      var showCityPickerButton = document.getElementById('showCityPicker');
      var cityResult = document.getElementById('cityResult');
      showCityPickerButton.addEventListener('tap', function(event) {
        cityPicker.show(function(items) {
          document.getElementById('city').innerText = items[0].text; //JSON.stringify(items[0]);序列化结果
          //返回 false 可以阻止选择框的关闭
          //return false;
        });
      }, false);
    },
    itemsFregment: function(items, idStart) {
      console.log('index start:', idStart);
      return T.createRowBasedFregment(items, T.cardMallTemplate, idStart);
    }
  });
})(mui, window.app, window.app.Template);