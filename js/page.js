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
        var view = plus.webview.currentWebview();
        var pview = view.parent()
        if(pview && pview.item) {
          self.currentItem = pview.item;
        }
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
      this.nextUrl = null;
      this.currentItem = null;
      this.hasMore = true;
      this.refreshing = false;
      this.data = [];
      this.meta = null;
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
      if (!self.options['pullUp']) {
        return;
      }
      if (mui.os.plus) {
        mui.plusReady(function() {
          setTimeout(function() {
            self.startPullUp();
          }, 1000);
        });
      } else {
        mui.ready(function() {
          self.startPullUp();
        });
      }
    },
    startPullDown: function() {
      console.log('start pulling down');
      this.getWillRefreshContainers().pullRefresh().pulldownLoading();
    },
    endPullDown: function() {
      console.log('end pulling down');
      this.getWillRefreshContainers().pullRefresh().endPulldownToRefresh();
    },
    startPullUp: function() {
      console.log('start pulling up');
      this.getWillRefreshContainers().pullRefresh().pullupLoading();
    },
    endPullUp: function(flag) {
      console.log('end pulling up');
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
      console.log('pull down url:' + apiUrl);
      $.ajax({
        'url': apiUrl,
        'success': function(data) {
          var items = data[self.getDataKey()];
          self.clearItems();
          self.appendItems(items);
          self.judgeMore(data.meta);
          if($.isFunction(self.afterLoading)) {
            self.afterLoading();
          }
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
        self.endPullUp(true);
        return;
      }
      console.log('pull up url: '+  self.getNextUrl());
      $.ajax({
        'url': app.apiUrl(self.getNextUrl()), 
        'success': function(data) {
          var items = data[self.getDataKey()];
          self.appendItems(items);
          self.judgeMore(data.meta);
          if($.isFunction(self.afterLoading)) {
            self.afterLoading();
          }
        },
        'complete': function() {
          console.log('finish pull up refresh');
          self.endPullUp(!self.hasMore);
        }
      });
      
    },
    judgeMore: function(meta) {
      this.meta = meta
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
      container.appendChild(this.itemsFragment(items, this.data.length));
    },
    itemsFragment: function(items, idStart) {
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
        'needPullUp': true,
        'needPullDown': true,
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
      var refreshOpitions = {
        down: {
          callback: false 
        },
        up: {
          offset: 200,
          contentdown: '',
          callback: false
        }
      };
      if(self.options['needPullDown']) {
        refreshOpitions.down.callback = function() {
          self.pullDownRefresh();
        }
      } 
      if(self.options['needPullUp']) {
        refreshOpitions.up.callback = function() {
          self.pullUpRefresh();
        }
      }
      $.each(document.querySelectorAll(self.options['pullRefreshContainerId']), function(index, pullRefreshEl) {
        $(pullRefreshEl).pullToRefresh(refreshOpitions);
      });
    },
    startPullDown: function() {
      console.log(this.target, 'start pulling down');
      this.getWillRefreshContainers().pullToRefresh().pullDownLoading();
    },
    endPullDown: function() {
      console.log(this.target, 'end pulling down');
      this.getWillRefreshContainers().pullToRefresh().endPullDownToRefresh();
    },
    startPullUp: function() {
      console.log(this.target, 'start pulling up');
      this.getWillRefreshContainers().pullToRefresh().pullUpLoading();
    },
    endPullUp: function(flag) {
      console.log(this.target, 'end pulling up', flag);
      this.getWillRefreshContainers().pullToRefresh().endPullUpToRefresh(flag);
    },
    refresh: function() {
      this.getWillRefreshContainers().pullToRefresh().refresh(true);
    },
    getWillRefreshContainers: function() {
      var pullDownContainerId = this.options['pullRefreshContainerId'];
      return $(pullDownContainerId);
    },
    getNextUrl: function() {
      return this.nextUrl[this.target] ? this.nextUrl[this.target] : this.getInitUrl();
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
//        console.log(JSON.stringify(items));
          self.clearItems();
          self.appendItems(items);
          self.refresh();
          self.judgeMore(data.meta);
        },
        'complete': function() {
          self.endPullDown();
        }
      });
    },
    pullUpRefresh: function() {
      console.log(this.target, '==== start pulling up ====');
      var self = this;
      if(false === self.hasMore[self.target]) {
        console.log('no more')
        self.endPullUp(true);
        return;
      }
      console.log('pull up url: ', self.getNextUrl());
      $.ajax({
        'url': app.apiUrl(self.getNextUrl()), 
        'success': function(data) {
          var items = data[self.getDataKey()];
          self.judgeMore(data.meta);
          self.appendItems(items);
        },
        'complete': function() {
          console.log('finish pull up refresh', self.hasMore[self.target]);
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
      container.appendChild(this.itemsFragment(items, this.getCurrentDataRef().length));
    },
    itemsFragment: function(items, idStart) {
      return document.createDocumentFragment();
    }
  });    
  
  var PullRefreshPage = PullWithTabPage.extend({
    
  });

  app.Page = Page;
  app.PullPage = PullPage;
  app.PullWithTabPage = PullWithTabPage;
})(mui, window.app)
