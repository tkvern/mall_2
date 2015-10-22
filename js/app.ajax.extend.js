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
        $.ajaxSettings = $.extend($.ajaxSettings, {
            beforeSend: function(xhr, settings) {
            		if(app.isLogin()) {
            			xhr.setRequestHeader('X-ACCESS-TOKEN', app.getAccessToken());
            		}
            },
            // 调试使用
            complete: function(xhr, status) {
            		console.log(status, xhr.responseText);
            },
            // type: "timeout", "error", "abort", "parsererror"
            error: function(xhr, type, error) {
            		console.log(type, error);
            		if(type == "timeout") {
            			plus.nativeUI.toast('网络请求超时, 请确保网络连接正常后重试');
            		} else if(type == "error") {
            			// 未登录
            			if(xhr.status == 401) {
            				if($.jumpToLoginWindow) {
            					$.jumpToLoginWindow.call();
            				} else {
            					plus.nativeUI.toast('请登录');
            				}
            			} else {
            				plus.nativeUI.toast($.parseJSON(xhr.responseText).message);
            			}
            		} else {
            			console.log(type, error);
            		}
            }
        });     

	});
})(mui);