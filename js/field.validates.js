(function($){
	$.Validation = {
		validateMobile: function(element) {
			var mobilePattern = /^1[\d]{10}$/;
			return {
				state: !!element.value.match(mobilePattern),
				error: '手机号码格式错误'
			};
		},
		validatePasswordLength: function(element) {
			return {
				state: element.value.length >= 6 && element.value.length <= 32,
				error: '密码长度为6-32位'
			}
		},
		validateEmptyPassword: function(element) {
			return {
				state: element.value.length != 0,
				error: '密码不能为空'
			}
		},
		validateSecurityCode: function(element) {
			var scPattern = /[\d]{6}/;
			return {
				state: !!element.value.match(scPattern),
				error: '验证码应为6位有效数字'
			};
		}
	}
})(mui);
