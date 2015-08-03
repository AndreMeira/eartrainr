var types = {
    'mp3': 'audio/mpeg',
    'ogg': 'audio/ogg',
    'wav': 'audio/wav',
    'aac': 'audio/aac',
    'm4a': 'audio/x-m4a'
};

/**
 *
 */
var sourceFactory = function (source) {
	return _.extend(document.createElement('source'), {
		src: source,
		type: types[source.split('.').pop()] || types["mp3"]
	});
};


var extended = {
	/**
	 *
	 */
	setSource: function (src, formats) {
		return this.addSources(_.map(formats, function (format) {
			return src + '.' + format;
		}));
	},

	/**
	 *
	 */
	addSources: function (sources) {
		for (var i = 0, j = sources.length; i < j; i++) {
			this.addSource(sources[i]);
		}
		return this;
	},

	/**
	 *
	 */
	addSource: function (source) {
		this.appendChild(sourceFactory(source));
		return this;
	},

	/**
	 *
	 */
	on: function (event, callback) {
		this.addEventListener(event, callback, true);
		return this;
	},

	/**
	 *
	 */
	off: function (event, callback) {
		this.removeEventListener(event, callback, true);	
		return this;
	},		

	/**
	 *
	 */
	stop: function () {
		this.pause();
		this.rewind();
	},

	/**
	 *
	 */
	rewind: function () {
		this.currentTime = 0;
	}

};
/**
 *
 */
var soundFactory = function () {
	return _.extend(document.createElement('audio'), extended);
};

module.exports = function (src, formats) {
	return soundFactory().setSource(src, formats);
};