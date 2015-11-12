(function($, app, T){
  app.UserCollectPage = app.PullWithTabPage.extend({
    init: function(options) {
      this._super(options);
      this.mfirst = true
    },
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
      return 'user/' + this.target + '?size=30';
    },
//  getNextUrl: function() {
//    return this.nextUrl[this.target] ? this.nextUrl[this.target] : this.getInitUrl();
//  },
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
      var pullDownContainerId = '#' + this.target + 'Scroll';
      console.log('=======', pullDownContainerId, '=========');
      return $(pullDownContainerId);
    },
//  clearItems: function() {
//    this.clearList();
//    this.data[this.target] = [];
//  },
    itemsFragment: function(items, idStart) {
      console.log('collect===', items.length);
      if(this.target == 'shops') {
        return T.collectShopTableViewTemplate(items, idStart);
      } else {
        return T.collectMallTableViewTemplate(items, idStart);
      }
    },
    addEventForSlider: function() {
      var self = this;
      document.getElementById('slider').addEventListener('slide', function(e) {
        var slideNumber  = e.detail.slideNumber;
        if(slideNumber == 0) {
          self.target = 'shops';
        } else {
          self.target = 'malls';
          if(self.mfirst) {
            self.mfirst = false;
            self.startPullDown();
          } 
        }
        console.log(self.target, '===>', slideNumber);
      });
    }
  });
})(mui, window.app, window.app.Template);

new window.app.UserCollectPage({
  'pullRefreshContainerId': '.mui-slider-group .mui-scroll',
  'needPullUp': false
}).start();