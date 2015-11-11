(function($, app){
  var Page = mui.Class.extend({
    init: function(options) {
      this.options = {};
      $.extend(true, this.options, options);
      this.pageInit();
    },
    getOption: function(optionName) {
      return this.options[optionName];
    },
    start: function() {
      var self = this;
      self.plain();
      $.ready(function(){
        self.pageReady();
      });
      $.plusReady(function(){
        self.plusReady();
      });
    },
    pageInit: function() {
      $.init(this.getOption('windowInitOptions'));
    },
    plain: $.noop,
    pageReady: $.noop,
    plusReady: $.noop
  });

  var PullPage = Page.extend({
    init: function(options) {
      this.options = {
        'dataKey': 'data',
        'pullRefreshContainerId': '#refreshContainer',
        'itemsContainerId': '#itemCoontainer',
        'pullUp': true,
        'pullDown': true,
        'windowInitOptions': {}
      }
      $.extend(true, this.options, options);
      this.pageInit();
      this.nextUrl = this.options['apiUrl'];
      this.currentItem = null;
      this.hasMore = true;
      this.refreshing = false;
      this.data = [];
    },
    pageInit: function() {
      var self = this;
      var initOptions = this.options['windowInitOptions'];
      var pullRefreshOptions = {
        container: this.options['pullRefreshContainerId'],//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      }
      if(self.options['pullDown']) {
        pullRefreshOptions['down'] = {
          contentdown: "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
          contentover: "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
          contentrefresh: "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
          callback: function() {
            self.pullDownRefresh();
          }//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        }
      }
      if(self.options['pullUp']) {
        pullRefreshOptions['up'] = {
          contentrefresh: "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
          contentnomore: '没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
          callback: function() {
            self.pullUpRefresh();
          }//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        }
      }
      $.extend(pullRefreshOptions, initOptions['pullRefresh'] || {});
      initOptions['pullRefresh'] = pullRefreshOptions;
      $.init(initOptions);
    },
    startPullDown: function() {
      this.getWillRefreshContainers().pullRefresh().pulldownLoading();
    },
    endPullDown: function() {
      this.getWillRefreshContainers().pullRefresh().endPulldownToRefresh();
    },
    startPullUp: function() {
      this.getWillRefreshContainers().pullRefresh().pullupLoading();
    },
    endPullUp: function(flag) {
      this.getWillRefreshContainers().pullRefresh().endPullupToRefresh(flag);
    },
    getWillRefreshContainers: function() {
      var pullDownContainerId = this.options['pullRefreshContainerId'];
      return $(pullDownContainerId);
    },
    getNextUrl: function() {
      return this.nextUrl ? app.apiUrl(this.nextUrl) : this.getInitUrl();
    },
    getInitUrl: function() {
      throw new Error('must be implemented in subclass');
    },
    getCurrentDataRef: function() {
      return this.data;
    },
    getDataKey: function() {
      return this.options['dataKey'];
    }, 
    pullDownRefresh: function() {
      var self = this;
      var apiUrl = app.apiUrl(self.getInitUrl());
      console.log('pull down url:', apiUrl);
      $.ajax({
        'url': apiUrl,
        'success': function(data) {
          var items = data[self.getDataKey()];
          self.clearItems();
          self.appendItems(items);
          self.judgeMore(data.meta);
//        $(self.options['pullRefreshContainerId']).pullRefresh().refresh(true);
        },
        'complete': function() {
          self.endPullDown();
        }
      });
    },
    pullUpRefresh: function() {
      var self = this;
      if(!self.hasMore) {
        console.log('no more')
        self.endPullUp(!self.hasMore);
        return;
      }
      console.log('pull up url: ', self.getNextUrl());
      $.ajax({
        'url': app.apiUrl(self.getNextUrl()), 
        'success': function(data) {
          var items = data[self.getDataKey()];
          self.appendItems(items);
          self.judgeMore(data.meta);
        },
        'complete': function() {
          console.log('finish pull up refresh');
          self.endPullUp(!self.hasMore);
        }
      });
    },
    judgeMore: function(meta) {
      if(meta && meta.links && meta.links.next) {
        this.nextUrl = meta.links.next;
        this.hasMore = true;
      } else {
        this.hasMore = false;
      }
      return this.hasMore;
    }, 
    getItemsContainer: function() {
      var itemContainerId = this.options['itemsContainerId'];
      return $(itemContainerId)[0]; 
    },
    clearItems: function() {
      console.log('clear items');
      this.clearList();
      this.data = []; 
    }, 
    clearList: function() {
      var itemsContainer = this.getItemsContainer()
      while(itemsContainer.firstElementChild) {
        itemsContainer.removeChild(itemsContainer.firstElementChild);
      }
    },
    appendItems: function(items) {
      console.log('append items');
      this.updateList(items);
      var dataRef = this.getCurrentDataRef();
      for(var i = 0; i < items.length; i++) {
        dataRef.push(items[i]);
      }
    },
    updateList: function(items) {
      var container = this.getItemsContainer();
      container.appendChild(this.itemsFregment(items, this.data.length));
    },
    itemsFregment: function(items, idStart) {
      return document.createDocumentFragment();
    }
  });
  
  /*
   * pull refresh with tab
   */
  var PullWithTabPage = Page.extend({
    init: function(options) {
      this.options = {
        'dataKey': 'data',
        'pullRefreshContainerId': '#refreshContainer',
        'itemsContainerId': '#itemContainer',
        'pullUp': true,
        'pullDown': true,
        'windowInitOptions': {}
      }
      $.extend(true, this.options, options);
      this.pageInit();
      this.currentItem = null;
      this.refreshing = false;
      this.target = this.options['target'] || 'target';
      this.nextUrl = {};
      this.nextUrl[this.target] = this.options['apiUrl'];
      this.hasMore = {};
      this.hasMore[this.target] = this.options['target'];
      this.data = {};
    },
    pageInit: function() {
      var self = this;
      var initOptions = this.options['windowInitOptions'];
      $.init(initOptions);
      self.initPullToRefresh();
    },
    initPullToRefresh: function() {
      var self = this;
      var deceleration = mui.os.ios ? 0.003 : 0.0009;
      $('.mui-scroll-wrapper').scroll({
        bounce: false,
        indicators: true, //是否显示滚动条
        deceleration:deceleration
      });
      $.each(document.querySelectorAll(self.options['pullRefreshContainerId']), function(index, pullRefreshEl) {
        $(pullRefreshEl).pullToRefresh({
          down: {
            auto: false,
            callback: function() {
              self.pullDownRefresh();
            }
          },
          up: {
            auto: false,
            contentdown: '',
            callback: function() {
              self.pullUpRefresh();
            }
          }
        });
      });
    },
    startPullDown: function() {
      this.getWillRefreshContainers().pullToRefresh().pullDownLoading();
    },
    endPullDown: function() {
      this.getWillRefreshContainers().pullToRefresh().endPullDownToRefresh();
    },
    startPullUp: function() {
      this.getWillRefreshContainers().pullToRefresh().pullUpLoading();
    },
    endPullUp: function(flag) {
      this.getWillRefreshContainers().pullToRefresh().endPullUpToRefresh(flag);
    },
    getWillRefreshContainers: function() {
      var pullDownContainerId = this.options['pullRefreshContainerId'];
      return $(pullDownContainerId);
    },
    getNextUrl: function() {
      return this.nextUrl[this.target] ? app.apiUrl(this.nextUrl[this.target]) : this.getInitUrl();
    },
    getInitUrl: function() {
      return this.options['apiUrl'] || '';
    },
    getCurrentDataRef: function() {
      ref = this.data[this.target];
      if (ref == null || ref == undefined) {
        ref = this.data[this.target] = [];
      }
      return ref;
    },
    getDataKey: function() {
      return this.options['dataKey'];
    }, 
    pullDownRefresh: function() {
      var self = this;
      var apiUrl = app.apiUrl(self.getInitUrl());
      console.log('pull down url:', apiUrl);
      $.ajax({
        'url': apiUrl,
        'success': function(data) {
          var items = data[self.getDataKey()];
          self.clearItems();
          self.appendItems(items);
          self.judgeMore(data.meta);
        },
        'complete': function() {
          self.endPullDown();
        }
      });
    },
    pullUpRefresh: function() {
      var self = this;
      if(!self.hasMore[self.target]) {
        console.log('no more')
        self.endPullUp(true);
        return;
      }
      console.log('pull up url: ', self.getNextUrl());
      $.ajax({
        'url': app.apiUrl(self.getNextUrl()), 
        'success': function(data) {
          var items = data[self.getDataKey()];
          self.appendItems(items);
          self.judgeMore(data.meta);
        },
        'complete': function() {
          console.log('finish pull up refresh');
          self.endPullUp(!self.hasMore[self.target]);
        }
      });
    },
    judgeMore: function(meta) {
      if(meta && meta.links && meta.links.next) {
        this.nextUrl[this.target] = meta.links.next;
        this.hasMore[this.target] = true;
      } else {
        this.hasMore[this.target] = false;
      }
      return this.hasMore[this.target];
    }, 
    getItemsContainer: function() {
      var itemContainerId = this.options['itemsContainerId'];
      return $(itemContainerId)[0]; 
    },
    clearItems: function() {
      console.log('clear items');
      this.clearList();
      this.data[this.target] = []; 
    }, 
    clearList: function() {
      var itemsContainer = this.getItemsContainer()
      while(itemsContainer.firstElementChild) {
        itemsContainer.removeChild(itemsContainer.firstElementChild);
      }
    },
    appendItems: function(items) {
      console.log('append items');
      this.updateList(items);
      var dataRef = this.getCurrentDataRef();
      for(var i = 0; i < items.length; i++) {
        dataRef.push(items[i]);
      }
    },
    updateList: function(items) {
      var container = this.getItemsContainer();
      container.appendChild(this.itemsFregment(items, this.data.length));
    },
    itemsFregment: function(items, idStart) {
      return document.createDocumentFragment();
    }
  });    

  app.Page = Page;
  app.PullPage = PullPage;
  app.PullWithTabPage = PullWithTabPage;
})(mui, window.app)
