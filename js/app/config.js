module.exports =  {
	baseUrl  : '',
	
	mediaUrl : function () {
		return this.baseUrl + '/media';
	},
	
	soundsUrl: function () {
		return this.mediaUrl() + '/sounds';
	},
	
	soundsExtSupported: function () {
		
	}
};