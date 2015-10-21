(function($){
	$.MaoAPI = {
		'router': function(url) {
			return 'http://192.168.1.16:8080/api/v1/' + url;
		},
		
		'securityCode': function(params, callback) {
			return mui.post(
				this.router('security_codes'),
				params,
				callback
			);
		},
		
		'register': function(params, callback) {
			return mui.post(
				this.router('users'),
				params, 
				callback
			);
		},
		
		'login': function(params, callback) {
			return mui.post(
				this.router('authorizations'),
				params,
				callback
			);
		},
		
		'logout': function(params, callback) {
			return mui.delete(
				this.router('authorizations'),
				params,
				callback
			)
		}
	}
})(mui);
