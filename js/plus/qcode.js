(function($, app, T) {
  app.QcodePage = app.Page.extend({
    plusReady: function() {
      this.requestForDetail();
      this.renderQCode();
    },
    requestForDetail: function() {
      var w = plus.webview.currentWebview();
      var userCoupon = w.userCoupon;
      var shopId = userCoupon.coupon.shop_id;
      var self = this;
      $.ajax({
        url: app.apiUrl('shops/' + shopId),
        success: function(data) {
          self._renderBrand(data.shop);
        },
        complete: function() {
        }
      })
    }, 
    _renderBrand: function(shop) {
      var brand = T.brandShopTemplate(shop);
      $('.mui-content .header')[0].innerHTML = brand;
    },
    renderQCode: function() {
      userCoupon = plus.webview.currentWebview().userCoupon;
      var qrcode = new QRCode(document.getElementById("qrcode"), {
        text: "mh-" + userCoupon.uuid,
        width: 128,
        height: 128,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
      });
    }
  })
})(mui, window.app, window.app.Template);
