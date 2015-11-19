/*
 * ajax 拓展
 */
(function($) {
	function _simulateMethod(methodName) {
		return function(url, data, success, dataType) {
			options = {
				type: methodName.toUpperCase(),
				url: url,
				headers: {'X-HTTP-METHOD-OVERRIDE': methodName.toUpperCase()},
				data: data,
				success: success,	
				dataType: dataType
			}
			return $.ajax(options);
		}
	}
	
	$.put = _simulateMethod('put');
	$.patch = _simulateMethod('patch');
	$.delete = _simulateMethod('delete');

  $.plusReady(function() {
       /*
        * 默认的错误处理逻辑
        * type: "timeout", "error", "abort", "parsererror"
        */
      var defaultErrorHandler = function(xhr, type, error) {
        console.log("Error: ", "type: " + type, "error:" + error, "http status:" + xhr.status);
        if(type == "timeout") {
          plus.nativeUI.toast('你的网络好像不给力, 请稍后重试');
        } else if(type == "error") {
        // 未登录
          if(xhr.status == 401) {
            window.app.clearLoginInfo();
            if(window.app.jumpToLoginWindow) {
              window.app.jumpToLoginWindow.call();
            } else {
              plus.nativeUI.toast('请登录');
            }
          } else {
            plus.nativeUI.toast($.parseJSON(xhr.responseText).error);
          }
        } else {
          console.log(type, error, xhr.status);
          plus.nativeUI.toast('未知错误');
        }
      }
      
      $.extend($.ajaxSettings, {
          timeout: 10000,
          beforeSend: function(xhr, settings) {
            console.log('before send:', app.isLogin());
            if(app.isLogin()) {
              console.log('X-ACCESS-TOKEN:', app.getAccessToken());
              xhr.setRequestHeader('X-ACCESS-TOKEN', app.getAccessToken());
            }
            var completeHandler = settings.complete;
            settings.complete = function(/* xhr, status */ ) {
              console.log(arguments[1] + arguments[0].responseText);
              if(completeHandler) {
                completeHandler.apply(settings.context, arguments);
              }
            }
            var errorHanler = settings.error;
            settings.error = function(/* xhr, type, error */) {
              if(!errorHanler || errorHanler.apply(settings.context, arguments) !== false) {
                defaultErrorHandler.apply(settings.context, arguments);
              }
            }
          }
      });     
	});
})(mui);