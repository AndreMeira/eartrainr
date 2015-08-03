module.exports =  {
	baseUrl  : '/eartrainr',
	
	mediaUrl : function () {
		return this.baseUrl + '/media';
	},
	
	soundsUrl: function () {
		return this.mediaUrl() + '/sounds';
	},
	
	soundsExtSupported: function () {
		
	}
};