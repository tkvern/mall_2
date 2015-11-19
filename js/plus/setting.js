(function($, app) {
  app.SettingPage = app.Page.extend({
    pageReady: function() {
      this.initActionText();
      this.initSingPage();
    },
    plusReady: function() {
      this.addEventForCouponsTap();
      this.addEventForCollectTap();
      this.addEventForAction();
      this.checkUpdate();
      this.showWelcom();
    },
    initActionText: function() {
      if(app.isLogin()) {
        var mobile = app.getCurrentUser().mobile;
        document.getElementById('account1').innerHTML = mobile; 
        document.getElementById('account2').innerHTML = mobile; 
        $('#action')[0].innerText = '退出登录';
      } else {
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
        if(app.isLogin()) {
          self.logout();
        } else {
          self.login();
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
        url: app.apiUrl('user/token'),
        type: 'DELETE',
        complete: function() {
          app.clearLoginInfo();
          app.jumpToLoginWindow(); 
          plus.webview.currentWebview().reload(true);
        }
      });
    },
    checkUpdate: function() {
      document.getElementById("update").addEventListener('tap', function() {
        var server = "http://www.dcloud.io/check/update"; //获取升级描述文件服务器地址
        mui.getJSON(server, {
          "appid": plus.runtime.appid,
          "version": plus.runtime.version,
          "imei": plus.device.imei
        }, function(data) {
          if (data.status) {
            plus.ui.confirm(data.note, function(i) {
              if (0 == i) {
                plus.runtime.openURL(data.url);
              }
            }, data.title, ["立即更新", "取　　消"]);
          } else {
            mui.toast('茂号已是最新版本~')
          }
        });
      });
    },
    showWelcom: function() {
      document.getElementById("welcome").addEventListener('tap', function(e) {
        //显示启动导航
        mui.openWindow({
          id: 'guide',
          url: 'guide.html',
          show: {
            aniShow: 'fade-in',
            duration: 300
          },
          waiting: {
            autoShow: false
          }
        });
      });
    }
  });
})(mui, window.app)

