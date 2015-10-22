(function($){
	$.plusReady() {
		$.Validation = {
			'validateMobile': function(element) {
				var mobilePattern = /^1[\d]{10}$/;
				return !!element.value.match(mobilePattern);
			},
			'validatePassword': function(element) {
				
			},
			'validateSecurityCode'： function(element) {
				
			}
		}
	}
})(mui);
