(function($, app, T){
  app.UserCollectPage = app.Page.extend({
    plusReady: function() {
      this.fetchCollectShops();
      this.fetchCollectMalls();
      this.addEventForCancelShop();
      this.addEventForCancelMall();
    }, 
    fetchCollectShops: function() {
      var self = this;
      $.ajax({
        url: app.apiUrl('user/shops'),
        success: function(data) {
          self.renderShopsTableView(data.shops);
        }
      })
    }, 
    fetchCollectMalls: function() {
      var self = this;
      $.ajax({
        url: app.apiUrl('user/malls'), 
        success: function(data) {
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
      $('#shopsContent').on('tap', '.mui-slider-right a', function(){
        var li = this.parentNode.parentNode;
        var shopId = li.id.split('=')[1];
        $.ajax({
          url: app.apiUrl('shops/' + shopId + '/unconcern'),
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
    addEventForCancelMall: function() {
      $('#mallsContent').on('tap', '.mui-slider-right a', function(){
        var li = this.parentNode.parentNode;
        var mallId = li.id.split('=')[1];
        $.ajax({
          url: app.apiUrl('malls/' + mallId + '/unconcern'),
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
    }
  });
})(mui, window.app, window.app.Template);

new window.app.UserCollectPage().start();