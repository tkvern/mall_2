(function($, app, T) {
  var GrapPage = app.PullPage.extend({
    getInitUrl: function() {
      var id = plus.webview.currentWebview().id;
      return app.apiUrl(id);
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
      if(this.data.length < 1) {
        var content = document.getElementById('coupon-list');
        content.innerHTML = "<p class='text-center'>商城没有可抢的优惠劵~~</p>"
      }
    },
    plusReady: function() {
      this.addEventForCouponGrap();
      this.addEventForConcernOrUnconcern();
      document.getElementById('brand').innerHTML = T.brandMallTemplate(this.currentItem);
    },
    addEventForCouponGrap: function() {
      mui('#coupon-list').on('tap', '.collect.danger .type', function(event) {
        var button = this;
        var couponId = this.id.split(':')[1];
        plus.nativeUI.showWaiting('抢劵中');
        $.ajax({
          url: app.apiUrl('coupons/' + couponId + '/grab'),
          type: 'POST',
          success: function(data) {
            plus.nativeUI.closeWaiting();
            button.parentNode.className = button.parentNode.className.replace('danger', 'success');
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
            url: app.apiUrl('malls/' + self.currentItem.id + '/concern'),
            type: 'POST',
            success: function() {
              heart.status = 1;
              heart.innerHTML = "<i class='fa fa-heart fa-2x'></i>";
              plus.nativeUI.toast('收藏成功');   
            }
          });
          
        } else {
          $.ajax({
            url: app.apiUrl('malls/' + self.currentItem.id + '/unconcern'),
            type: 'DELETE',
            success: function() {
              heart.status = 0;
              heart.innerHTML = "<i class='fa fa-heart-o fa-2x'></i>";
              plus.nativeUI.toast('已取消收藏');
            }
          });
        }
      });
    }
  });

  app.GrapPage = GrapPage;
})(mui, window.app, window.app.Template);



