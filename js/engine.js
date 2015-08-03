
var Config    = require('./app/config');
var Class     = require('./engine/Class');
var Notes     = require('./engine/Music/Notes');
var Intervals = require('./engine/Music/Intervals');

var sequencer = new (require('./engine/Sequencer/Scheduler'))();
var piano     = new (require('./engine/Instrument/Piano'))(Config);
//@todo smartify
piano.loadSounds();

module.exports = new Class({
	//median: 30,
	state: null,
	currentNotes: [],
	rootNote : Notes.fromName('C3'),
	intervals: Intervals.toArray().slice(1),
	/**
	 * Pseudo constructor
	 */
	initialize: function (state) {
		this.state = state;			
		this.state.on('clicked:stop', _.bind(this.handleStop, this));
		this.state.on('clicked:play', _.bind(this.handlePlay, this));
		this.state.on('clicked:start', _.bind(this.handleStart, this));
		this.state.on('clicked:interval', _.bind(this.handleInterval, this));
		this.state.on('change:root-note', _.bind(this.handleRootNote, this));
		this.state.on('change:octave-from', _.bind(this.handleRootNote, this));
		//this.state.on('change:octave-range', _.bind(this.handleOctaveRange, this));
		this.state.on('change:allowed-intervals', _.bind(this.setIntervals, this));

	},

	/**
	 *
	 */
	handleStop: function (data) {
		this.state.set('mode', null);
		this.currentNotes = [];
		this.resetScore();
	},

	/**
	 *
	 */
	handleStart: function (data) {
		this.startGame();
		//this.handlePlay();
	},

	/**
	 *
	 */
	handlePlay: function (data) {
		if (!this.currentNotes.length) {
			this.chooseNotes();
		}
		
		this.playCurrentNotes();
	},

	/**
	 *
	 */
	handleInterval: function (data) {
		var interval  = data.interval || 'unisson';			
		this.playInterval(Intervals.fromName(interval), this.currentNotes[0] || null);
		this.playGame(interval);
	},

	/**
	 *
	 */
	handleRootNote: function () {
		this.setRootNote();
	},

	
	/**
	 *
	 */
	setIntervals: function (state, intervals) {
		this.intervals = intervals;
	},

	/**
	 *
	 */
	startGame: function () {
		this.state.set('mode', 'game');			
		this.resetScore();
		this.resetErrors();
		this.chooseNotes();
	},

	resetErrors: function () {
		this.state.set('errors', {});
	},

	/**
	 *
	 */
	resetScore: function () {
		this.state.set('score', 0);
		this.state.set('tries', 0);
	},

	/**
	 *
	 */
	 incrementTries: function () {
	 	var tries = this.state.get('tries') || 0;
	 	this.state.set('tries', tries + 1);
	 },

	 /**
	 *
	 */
	 incrementScore: function () {
	 	var score = this.state.get('score') || 0;
	 	this.state.set('score', score + 1);
	 	this.incrementTries();
	 },

	/**
	 *
	 */
	playGame: function (interval) {
		if (this.state.get('mode') !== 'game') {
			return;
		}

		if (!this.currentInterval()) {
			return;
		}

		if (this.currentInterval() !== interval) {
			this.incrementTries();
			this.pushError(this.currentInterval(), interval);
			this.state.trigger('answer:wrong', {
				answer: interval,
				expected: this.currentInterval()
			});
			return;
		}

		this.incrementScore();
		this.state.trigger('answer:right', {
			answer: interval,
			expected: this.currentInterval()
		});
		this.currentNotes = [];

	},

	/**
	 *
	 */
	pushError: function (right, answer) {

		var errors = this.state.get('errors');

		right  = right + "";
		answer = answer + "";

		if (!errors[right]) {
			errors[right] = {};
		}

		if (!errors[right]["global"]) {
			errors[right]["global"] = 0;
		}

		if (!errors[right][answer]) {
			errors[right][answer] = 0;
		}

		errors[right]["global"] = errors[right]["global"] + 1;
		errors[right][answer] = errors[right][answer] + 1;
	},

	/**
	 *
	 */
	currentInterval: function () {
		if (!this.currentNotes[0]) {
			return undefined;
		}

		return this.currentNotes[0].intervalTo(
			this.currentNotes[1]
		).name();
	},

	/**
	 *
	 */
	chooseNotes: function () {
		var index = Math.floor(Math.random() * this.intervals.length);			
		var interval      = Intervals.fromName(this.intervals[index]);
		var rootNote      = this.getRootNote(interval);
		this.currentNotes = [rootNote, rootNote.plus(interval)];
	},


	/**
	 *
	 */
	playInterval: function (interval, from) {
		var first  = from || this.getRootNote(),
			second = first.plus(interval);

		this.playNotes(first, second);
	},

	/**
	 *
	 */
	playCurrentNotes: function (interval) {
		var first  = this.currentNotes[0],
			second = this.currentNotes[1];

		this.playNotes(first, second);	
	},

	/**
	 *
	 */
	playNotes: function (first, second) {
		if (this.state.get('motion') == 'h') {
			piano.play([first, second]);
		}

		if (this.state.get('motion') == 'd') {
			this.playNotesUpward(second, first);
		}

		if (this.state.get('motion') == 'u') {
			this.playNotesUpward(first, second);
		}

		if (!this.state.get('motion')) {
			this.playNotesUpward(first, second);
		}
	},

	/**
	 *
	 */
	playNotesUpward: function (first, second) {
		piano.stop();
		sequencer.stop();
		sequencer.timeline().clear();

		sequencer.timeline().setAt(0, function () {
			piano.play([first]);
		});

		sequencer.timeline().setAtBar(1/4, function () {
			piano.stop([first]);
			piano.play([second]);
		});

		sequencer.play(0, 1);
	},

	/**
	 *
	 */
	setRootNote: function () {
		if (this.state.get('root-note') == 'random') {
			return;
		}

		this.rootNote = Notes.fromName(
			this.state.get('root-note')   || 'C', 
			this.state.get('octave-from') ||  3
		);
	},	

	/**
	 *
	 */
	getRootNote: function (interval) {

		if (!interval
		|| this.state.get('mode') !== 'game'
		|| this.state.get('root-note') !== 'random') {
			return this.rootNote;
		}

		return this.randomRootNote(interval);
	},

	/**
	 *
	 */
	randomRootNote: function (itv) {
		itv = itv ? itv.valueOf() : 0;
		
		var range = this.state.get('octave-range') || 1;
		var from  = this.state.get('octave-from')  || 3;
		
		var range  = range * 12;                                 // | 1 * * * * * * * * * * 12|
		var range  = range - 1;                                  // | 0 * * * * * * * * * * 11| 
		var chosen = Math.round(Math.random() * range);          // | 0 * * * * * * * c * * * |
		    chosen = (from - 1) * 12 + chosen;					 // |23 * * * * * * * c * * 35|
		    chosen =  chosen + itv > piano.range() ? piano.range() - itv : chosen;	

		return Notes.fromIndex(chosen);
	}
});