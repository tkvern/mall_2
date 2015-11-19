(function($, app, T) {
  var MerchantPage = app.PullPage.extend({
    getInitUrl: function() {
      return app.apiUrl('shops/' + this.currentItem.id + '/coupons');
    },
    itemsFragment: function(items, idStart) {
      return T.createRowBasedFragment(items, T.couponTemplate, idStart);
    },
    afterLoading: function() {
      var heart = document.getElementById('heart');
      if(this.meta.scope_concerned) {
        heart.status = 1;
        heart.innerHTML = "<i class='fa fa-heart fa-2x'></i>";
      } else {
        heart.status = 0;
        heart.innerHTML = "<i class='fa fa-heart-o fa-2x'></i>";
      }
    },
    plusReady: function() {
      console.log('plusReady:', this.nextUrl);
      this.addEventForPageEnter();
      this.addEventForCouponGrap();
      this.addEventForConcernOrUnconcern();
    },
    addEventForPageEnter: function() {
      var self = this;
      window.addEventListener('pageEnter', function(e) {
        console.log('grap page enter', JSON.stringify(e.detail));
        shop = e.detail.shop;
        if(self.currentItem && self.currentItem.id == shop.id) {
          return;
        }
        self.currentItem = shop;
        self.clearItems();
        document.getElementById('brand').innerHTML = T.brandShopTemplate(self.currentItem);
        $(self.options['pullRefreshContainerId']).pullRefresh().pulldownLoading();       
      });
    },
    addEventForCouponGrap: function() {
      mui('#coupon-list').on('tap', '.collect.danger .type', function(event) {
        var button  = this;
        var couponId = this.id.split(':')[1];
        plus.nativeUI.showWaiting('抢劵中');
        $.ajax({
          url: app.apiUrl('coupons/' + couponId + '/grab'),
          type: 'POST',
          success: function(data) {
            plus.nativeUI.closeWaiting();
            button.parentNode.className = button.parentNode.className.replace('danger', 'success');
            button.innerText = "已抢";
            plus.nativeUI.toast(data.message || data.error, {duration: 'long'});
          },
          error: function() {
            plus.nativeUI.closeWaiting();
          }
        });
      });
    },
    addEventForConcernOrUnconcern: function() {
      var self = this;
      $('.mui-content').on('tap', '#heart', function(e) {
        var heart = this;
        if(!heart.status) {
          $.ajax({
            url: app.apiUrl('shops/' + self.currentItem.id + '/concern'),
            type: 'POST',
            success: function() {
              heart.status = 1;
              console.log(heart.className);
              heart.innerHTML = "<i class='fa fa-heart fa-2x'></i>";
              plus.nativeUI.toast('收藏成功');   
            }
          });
          
        } else {
          $.ajax({
            url: app.apiUrl('shops/' + self.currentItem.id + '/unconcern'),
            type: 'DELETE',
            success: function() {
              heart.status = 1;
              console.log(heart.className);
              heart.innerHTML = "<i class='fa fa-heart-o fa-2x'></i>";
              plus.nativeUI.toast('已取消收藏');
            }
          });
        }
      });
    }
  });

  app.MerchantPage = MerchantPage;
})(mui, window.app, window.app.Template);
