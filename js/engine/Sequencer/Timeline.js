
var noop  = function () {};
var Class = require('../Class');

/**
 * Class timeline
 */
module.exports = new Class({
	/**
	 * Constructor
	 */
	initialize: function (beatsPerBar) {
		this.head  = 0;
		this.stack = [];
		this.beatsPerBar = beatsPerBar;
	},
	
	/**
	 * 
	 */
	clear: function () {
		this.stack = [];
		return this.rewind();
	},

	/**
	 * @todo Is that keep the proto? 
	 */
	copy: function () {
		return _.clone(this);
	},
	
	/**
	 * Exec the current position of timeline
	 */
	exec : function () {
		_.each((this.stack[this.head] || []), _.bind(function (c) {
			c(this);
		}, this));
		return this;
	},
	
	/**
	 * Exec the current position and go next 
	 */
	play: function () {
		this.exec();
		this.next();
		return this;
	},
	
	/**
	 * Go to the next beat
	 */
	next: function () {
		this.head += 1;
		return this;
	},
	
	/**
	 * Go to the next beat
	 */
	previous: function () {
		this.head -= 1;
		return this;
	},
	
	/**
	 * Set head at the very begin
	 */
	rewind: function () {
		this.goTo(0);
		return this;
	},
	
	/**
	 * Set every given beats the callback
	 */
	setEvery: function (beats, from, to, callback) {
		for (var i = from; i < to; i += beats) {
			this.setAt(i, callback);
		}
	},
	
	/**
	 * Set every given beats the callback
	 */
	setEveryBar: function (nbBar, from, to, callback) {
		to   = Math.round(to * this.beatsPerBar);
		from = Math.round(from * this.beatsPerBar);
		var beats = Math.round(nbBar * this.beatsPerBar);
		
		this.setEvery(beats, from, to, callback);
	},
	
	/**
	 * Go to the given position
	 * Ex: timeline.goTo(3 + 1/4) means go to bar 3 at the second quarter note (0/4 is the first one)  
	 */
	goTo: function (bar) {
		this.head = Math.round(bar * this.beatsPerBar);
		return this;
	},
	
	/**
	 * Set a callback at position beats
	 */
	setAt: function (beats, callback) {
		var pos = Math.round(beats);
		
		if (!_.isFunction(callback)) {
			throw 'callback should be a function';
		}
		
		if (!this.stack[pos]) {
			this.stack[pos] = [];
		}
		
		this.stack[pos].push(callback);
		return this;
	},
	
	/**
	 * Set a callback at position
	 */
	setAtBar: function (bar, callback) {
		var pos = bar * this.beatsPerBar;
		this.setAt(pos, callback);
		return this;
	}
});