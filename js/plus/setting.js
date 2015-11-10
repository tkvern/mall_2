(function($, app) {
  app.SettingPage = app.Page.extend({
    pageReady: function() {
      this.initActionText();
      this.initSingPage();
    },
    plusReady: function() {
      console.log('setting plusready');
      this.addEventForCouponsTap();
      this.addEventForCollectTap();
      this.addEventForAction();
    },
    initActionText: function() {
      if(app.isLogin()) {
        $('#action')[0].text = '退出登录'
      } else {
        $('#action')[0].text = '立即登录'
      }
    },
    initSingPage: function() {
      var spa = $('#app').view({
        defaultPage: '#setting'
      });
      var oldBack = $.back;
      $.back = function() {
        if (spa.canBack()) { //如果view可以后退，则执行view的后退
          spa.back();
        } else { //执行webview后退
          oldBack();
        }
      };
    },
    addEventForCouponsTap: function() {
      document.getElementById('coupons').addEventListener('tap', function(e) {
        e.preventDefault();
        $.openWindow({
          url: '/plus/my/coupons.html',
          id: 'plus/my/coupons',
          createNew: true,
        });
      });
    },
    addEventForCollectTap: function() {
      document.getElementById('collect').addEventListener('tap', function(e) {
        e.preventDefault();
        $.openWindow({
          url: '/plus/my/collect.html',
          id: 'plus/my/collect',
          createNew: true,
        });
      });
    },
    addEventForAction: function() {
      var self = this;
      document.getElementById('action').addEventListener('tap', function(e) {
        if(this.text == '立即登录') {
          self.login();
        } else {
          self.logout();
        }
      });
    },
    login: function() {
      mui.openWindow({
        url: '/login.html',
        id: 'login',
        show: {
          aniShow: 'pop-in'
        },
        styles: {
          popGesture: 'hide'
        },
        waiting: {
          autoShow: true
        }
      });
    },
    logout: function() {
      $.ajax({
        url: app.apiUrl('/user/token'),
        type: 'DELETE',
        complete: function() {
          app.clearLoginInfo();
        }
      });
    }
  });
})(mui, window.app)

new window.app.SettingPage().start();
