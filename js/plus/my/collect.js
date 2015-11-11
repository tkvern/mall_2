(function($, app, T){
  app.UserCollectPage = app.PullWithTabPage.extend({
//  init: function(options) {
//    this._super(options);
//    this.data = {
//      shops: [],
//      malls: []
//    }
//    this.nextUrl = {}
//  },
    plain: function() {
      this.target = 'shops';
      this.addEventForSlider();
    },
    plusReady: function() {
      this.startPullDown();
    },
//  judgeMore: function(meta) {
//    if(meta && meta.links && meta.links.next) {
//      this.nextUrl[this.target] = meta.links.next;
//      this.hasMore = true;
//    } else {
//      this.hasMore = false;
//    }
//    return this.hasMore;
//  }, 
    getInitUrl: function() {
      return 'user/' + this.target;
    },
    getNextUrl: function() {
      console.log('here ==> ', this.nextUrl);
      return this.nextUrl[this.target] ? app.apiUrl(this.nextUrl[this.target]) : this.getInitUrl();
    },
    getItemsContainer: function() {
      var id = this.target + 'Container'
      return document.getElementById(id);
    },
    getDataKey: function() {
      return this.target;
    },
//  getCurrentDataRef: function() {
//    return this.data[this.target];
//  },
    getWillRefreshContainers: function() {
      var pullDownContainerId = '#' + this.target + 'Container';
      console.log('=======', pullDownContainerId, '=========');
      return $(pullDownContainerId);
    },
//  clearItems: function() {
//    this.clearList();
//    this.data[this.target] = [];
//  },
//  itemsFregment: function(items, idStart) {
//    if(this.target == 'shops') {
//      return T.createRowBasedFregment(items, T.userCouponTemplate, idStart)
//    } else {
//      return;
//    }
//  },
    addEventForSlider: function() {
      var self = this;
      document.getElementById('slider').addEventListener('slide', function(e) {
        var slideNumber  = e.detail.slideNumber;
        if(slideNumber == 0) {
          self.target = 'shops';
        } else {
          self.target = 'malls';
        }
        console.log(self.target, '===>', slideNumber);
      });
    }
  });
})(mui, window.app, window.app.Template);

new window.app.UserCollectPage({
'pullRefreshContainerId': '.mui-slider-group .mui-scroll',
'itemsContainerId': '#plist',
'pullUp': true,
'pullDown': true
}).start();