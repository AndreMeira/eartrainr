
var noop      = function () {};
var Class     = require('../Class');
var Timeline  = require('./Timeline');

var protectedMethod = {
		
	/**
	 * Play the timeline 
	 */
	play: function (timeline) {
		var that  = this, 
			delay = 60000 / (this.bpm * this.SUB_BEATS);

		var callback = function () {
			that.timer = setTimeout(callback, delay);
			timeline.play();
		};
		setTimeout(callback, delay);
	},
	
	/**
	 * Configure the start and the end of timeline
	 */
	timelinePlayRange: function (timeline, from, to) {
		timeline.goTo( Math.min(from || 0, to || 60));
		timeline.setAtBar(Math.max(from || 0, to || 60), _.bind(function () {
			//console.log('stop');
			this.stop();
		}, this));
	}
};

/**
 * Class sequencer 	
 */
module.exports = new Class({
	/**
	 * Constructor
	 */
	initialize: function (rythm, subBeats) {
		this.currentTimeline;
		this.timelines  = [];
		this.bpm        = 120;
		this.timer      = null;
		this.rythm      = rythm    || 4;
		this.SUB_BEATS  = subBeats || 4;
	},
	
	/**
	 * get the timeline by its name
	 */
	timeline: function (name) {
		name = name + "" || "default"; 
		if (!this.timelines[name]) {
			this.timelines[name] = new Timeline(this.rythm * this.SUB_BEATS);
		}
		return this.timelines[name];
	},
	
	/**
	 * Gives the sub beats in a bar
	 */
	getSubBeatsInBar: function () {
		return this.rythm * this.SUB_BEATS;
	},
	
	/**
	 * Set the current timeline
	 */
	setCurrentTimeline: function (timelineName) {
		this.currentTimeline = this.timeline(timelineName);
		return this;
	}, 
	
	/**
	 * Play current timeline
	 */
	play: function (from, to) {
		var timeline = (this.currentTimeline || this.timeline()).copy();
		protectedMethod.timelinePlayRange.apply(this, [timeline, from, to]);
		protectedMethod.play.apply(this, [timeline]);
	},
	
	/**
	 * Stop the current play
	 */
	stop: function () {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
	}
});