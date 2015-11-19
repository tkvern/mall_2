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
      this.addEventForCancelShop();
      this.addEventForCancelMall();
      this.addEventForShopTap();
      this.addEventForMallTap();
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
        var shopIndex = parseInt(li.getAttribute('data-index'));
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
        var shopIndex = parseInt(li.getAttribute('data-index'));
        var shop = self.shops[shopIndex];
        mui.openWindow({
          url: li.id,
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
            item: shop
          }
        });
      });
    },
    addEventForCancelMall: function() {
      var self = this;
      $('#mallsContent').on('tap', '.mui-slider-right a', function(){
        var li = this.parentNode.parentNode;
        var mallIndex = parseInt(li.getAttribute('data-index'));
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
        var mallIndex = parseInt(li.getAttribute('data-index'));
        var mall = self.malls[mallIndex];
        mui.openWindow({
          url: li.id,
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
            item: mall
          }
        });
      });
    }
  });
})(mui, window.app, window.app.Template);

new window.app.UserCollectPage().start();