var Backbone = require('backbone');
var Class  = require('../Class');
var Sound  = require('../Audio/Sound');

returnThis = function () {
	return this;
};

returnTrue = function () {
	return true;
};

var mockSound = {
	play: returnThis,
	stop: returnThis,
	isMock: returnTrue
};

module.exports = new Class({
	loaded     : 0,
	notes      : [],
	name       : null,
	noteSounds : null,
	formats    : ['ogg', 'mp3'],
	onLoadCallbacks : null,

	/**
	 * Initialize
	 */
	initialize: function (myConfig) {
		this.config =  myConfig || config;
		this.events = _.extend({}, Backbone.Events);
	},

	/**
	 * fr: tessiture
	 */
	range: function () {
		return this.notes.length;
	},

	/**
	 * 
	 */
	lowerNote: function () {
		return this.notes[0];
	},

	/**
	 * 
	 */
	higherNote: function () {
		return this.notes[this.range() - 1];
	},

	/**
	 * Tells if loaded
	 */
	isLoaded: function () {
		return this.notes.length == this.loaded;
	},


	/**
	 * 
	 */
	soundsFromNotes: function (notes) {
		return _.map(notes, _.bind(function (note) {
			return this.note(note + "");
		}, this));
	},

	/**
	 * Play the sound
	 */
	play: function (notes) {
		if (!this.isLoaded()) {
			return this;
		}		
		
		var sounds = this.soundsFromNotes(notes);
		this.stopSounds(sounds);
		this.playSounds(sounds);
		return this;
	},

	/**
	 * 
	 */
	playSounds: function (sounds) {
		//play as close as possible
		setTimeout(function () {
			for (var i = 0, l = sounds.length; i < l; i++) {
				sounds[i].play();
			}
		}, 0);
	},

	/**
	 * 
	 */
	note: function (name) {
		return this.noteSounds[name] || mockSound;
	},

	/**
	 *
	 */
	stop: function (notes) {
		var sounds = notes ? this.soundsFromNotes(notes) : null;
		return this.stopSounds(sounds);
	},

	/**
	 *
	 */
	stopSounds: function (sounds) {
		_.each(sounds || this.noteSounds, _.bind(function (sound) {
			sound.stop();
		}, this));

		return this;
	},
	
	/**
	 * load the sound
	 */
	loadSounds: function () {
		if (this.noteSounds) {
			return this;
		}
		
		this.noteSounds = {};
		this._mapSounds();
		this._loadSounds();
		
	},

	/**
	 * load sound
	 */
	_mapSounds: function () {
		_.each(this.notes, _.bind(function (note) {
			var url  = this.getInstrumentSoundUrl() + '/' + encodeURIComponent(note);
			this.noteSounds[note] = new Sound(url, this.formats);
		}, this));
	},
	
	/**
	 * Map note with sounds
	 */
	_loadSounds: function () {
		_.each(this.noteSounds, _.bind(function (note) {
			note.on('loadeddata',      _.bind(this._soundLoadedCallback, this));
			note.on('dataunavailable', _.bind(this._soundUnavaibleCallback, this));
			note.load();
			note.volume = 1;
		}, this));
	},
	
	/**
	 * sound loaded callback 
	 */
	_soundLoadedCallback: function () {
		this.loaded = this.loaded + 1;
		
		if (this.loaded === this.notes.length) {
			this.events.trigger('ready', this);
		}
	},
	
	/**
	 * sound unavailable callback
	 */
	_soundUnavaibleCallback: function () {
		this.events.trigger('error', this);
	},
			
	/**
	 * get base url of instrument 
	 */
	getInstrumentSoundUrl: function () {
		return this.config.soundsUrl() + '/' + this.name;
	}
});