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
      var pullDownContainerId = this.options['pullRefreshContainerId'];
      $(pullDownContainerId).pullRefresh().pulldownLoading();
    },
    endPullDown: function() {
      var pullDownContainerId = this.options['pullRefreshContainerId'];
      $(pullDownContainerId).pullRefresh().endPulldownToRefresh();
    },
    startPullUp: function() {
      var pullDownContainerId = this.options['pullRefreshContainerId'];
      $(pullDownContainerId).pullRefresh().pullupLoading();
    },
    endPullUp: function(flag) {
      var pullDownContainerId = this.options['pullRefreshContainerId'];
      $(pullDownContainerId).pullRefresh().endPullupToRefresh(flag);
    },
    getNextUrl: function() {
      return this.nextUrl ? app.apiUrl(this.nextUrl) : this.getInitUrl();
    },
    getInitUrl: function() {
      throw new Error('must be implemented in subclass');
    },
    pullDownRefresh: function() {
      var self = this;
      var apiUrl = self.getInitUrl();
      console.log('pull down url:', apiUrl);
      $.ajax({
        'url': apiUrl,
        'success': function(data) {
          var items = data[self.options['dataKey']];
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
      console.log('pull up url: ', self.getNextUrl);
      $.ajax({
        'url': self.getNextUrl(), 
        'success': function(data) {
          var items = data[self.options['dataKey']];
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
      var itemsContainer = this.getItemsContainer()
      while(itemsContainer.firstElementChild) {
        itemsContainer.removeChild(itemsContainer.firstElementChild);
      }
      this.data = []; 
    }, 
    appendItems: function(items) {
      console.log('append items');
      var container = this.getItemsContainer();
      container.appendChild(this.itemsFregment(items, this.data.length));
      for(var i = 0; i < items.length; i++) {
        this.data.push(items[i]);
      }
    },
    itemsFregment: function(items, idStart) {
      return document.createDocumentFragment();
    }
  });

  app.Page = Page;
  app.PullPage = PullPage;
})(mui, window.app)
