(function($, app, T){
  app.UserCollectPage = app.Page.extend({
    init: function(options) {
      this._super(options);
      this.malls = [];
      this.shops = [];
    },
    plusReady: function() {
      this.fetchCollectShops();
      this.fetchCollectMalls();
      this.preload();
      this.addEventForCancelShop();
      this.addEventForCancelMall();
      this.addEventForShopTap();
      this.addEventForMallTap();
    }, 
    preload: function() {
      if(plus.webview.getWebviewById('plus/grap')) {
        return;
      }
      $.preload({
        url: '/plus/grap.html',
        id: 'plus/grap'
      })
    },
    fetchCollectShops: function() {
      var self = this;
      $.ajax({
        url: app.apiUrl('user/shops'),
        success: function(data) {
          self.shops = data.shops;
          self.renderShopsTableView(data.shops);
        }
      })
    }, 
    fetchCollectMalls: function() {
      var self = this;
      $.ajax({
        url: app.apiUrl('user/malls'), 
        success: function(data) {
          self.malls = data.malls;
          self.renderMallsTableView(data.malls);
        }
      });
    },
    renderShopsTableView: function(shops) {
      var shopDiv = document.getElementById('shopsContent');
      if(shops.length > 0) {
        shopDiv.firstElementChild.style.display = 'None';
        var child = T.collectShopTableViewTemplate(shops);
        shopDiv.appendChild(child);
      }
    },
    renderMallsTableView: function(malls) {
      var mallDiv = document.getElementById('mallsContent');
      if(malls.length > 0) {
        mallDiv.firstElementChild.style.display = 'None';
        mallDiv.appendChild(T.collectMallTableViewTemplate(malls));
      }
    },
    addEventForCancelShop: function() {
      var self = this;
      $('#shopsContent').on('tap', '.mui-slider-right a', function(){
        var li = this.parentNode.parentNode;
        var shopIndex = parseInt(li.id.split(':')[1]);
        shop =  self.shops[shopIndex];
        $.ajax({
          url: app.apiUrl('shops/' + shop.id + '/unconcern'),
          type: 'DELETE',
          success: function() {
            li.remove();
            var shopDiv = document.getElementById('shopsContent');
            if(!shopDiv.lastElementChild.firstElementChild) {
              shopDiv.lastElementChild.remove();
              shopDiv.firstElementChild.style.display = 'block';
            }
          }
        });
      });
    },
    addEventForShopTap: function() {
      var self = this;
      $('#shopsContent').on('tap', 'li .mui-slider-handle', function(){
        var li = this.parentNode;
        var shopIndex = parseInt(li.id.split(':')[1]);
        var shop = self.shops[shopIndex];
        var targetView = plus.webview.getWebviewById('plus/merchant');
        targetView.show();
        $.fire(targetView, 'pageEnter', {shop: shop});
      });
    },
    addEventForCancelMall: function() {
      var self = this;
      $('#mallsContent').on('tap', '.mui-slider-right a', function(){
        var li = this.parentNode.parentNode;
        var mallIndex = parseInt(li.id.split(':')[1]);
        mall = self.malls[mallIndex];
        $.ajax({
          url: app.apiUrl('malls/' + mall.id + '/unconcern'),
          type: 'DELETE',
          success: function() {
            li.remove();
            var mallDiv = document.getElementById('mallsContent');
            if(!mallDiv.lastElementChild.firstElementChild) {
              mallDiv.firstElementChild.style.display = 'block';
              mallDiv.lastElementChild.remove();
            }
          }
        });
      });
    },
    addEventForMallTap: function() {
      var self = this;
      $('#mallsContent').on('tap', 'li .mui-slider-handle', function(){
        var li = this.parentNode;
        var mallIndex = parseInt(li.id.split(':')[1]);
        var mall = self.malls[mallIndex];
        var targetView = plus.webview.getWebviewById('plus/grap');
        targetView.show();
        $.fire(targetView, 'pageEnter', {mall: mall});
      });
    }
  });
})(mui, window.app, window.app.Template);

new window.app.UserCollectPage().start();