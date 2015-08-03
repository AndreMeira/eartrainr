var itv = require('./Intervals');

/**
 * The 12 notes
 */
var notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * Enharmonic notation 
 */
var equiv = {
	'Ab' : 'G#',
	'Bb' : 'A#',
	'Cb' : 'B',
	'Db' : 'C#',
	'Eb' : 'D#',
	'Fb' : 'E',
	'Gb' : 'F#'
};

/**
 * 
 */
var note = function (name, octave) {	
	name = equiv[name] !== undefined ? equiv[name] : name;

	this.octave = function () {
		return parseInt(octave, 10) || 3;
	};

	this.name = function () {
		return name;
	};
};

/**
 * 
 */
note.prototype.index = function () {
	return notes.indexOf(this.name());
};

/**
 * 
 */
note.prototype.octaveIndex = function () {
	return this.index() + this.octave() * 12;
};

/**
 * 
 */
note.prototype.plus = function (semitones) {
	var length    = notes.length;
	var semitones = this.octaveIndex() + semitones.valueOf();
	var octave    = Math.floor(semitones / length);
	var name      = notes[(semitones % length + length) % length];
	
	return new note(name, octave);
};

/**
 * 
 */
note.prototype.minus = function (semitones) {
	return this.plus(-semitones.valueOf());
};

/**
 * 
 */
note.prototype.name = function () {
	return this.name();
};

/**
 * 
 */
note.prototype.fullName = function () {
	return this.name() + this.octave();
};


/**
 * 
 */
note.prototype.intervalTo = function (note) {
	return itv.fromSemitones(note.octaveIndex() - this.octaveIndex());
};

/**
 * 
 */
note.prototype.intervalFrom = function (note) {
	return itv.fromSemitones(this.octaveIndex(), note.octaveIndex());
};

/**
 * 
 */
note.prototype.intervalWith = function (note) {
	return note.octaveIndex() > this.octaveIndex() ?
		this.intervalTo(note) :
		this.intervalFrom(note); 
};

/**
 * 
 */
note.prototype.toString = function (note) {
	return this.fullName();
};

module.exports = {};

/**
 * 
 */
module.exports.fromName = function (name, octave) {
	octave = (name.match(/[0-9]+$/) || [])[0] || octave;
	return new note((name.match(/^[A-G#b]+/)  || [])[0], octave);
};

/**
 * 
 */
module.exports.fromIndex = function (index) {
	return this.fromName('C', 1).plus(index);
};


_.each(itv.toArray(), function (name) {
	var name = name.replace(/ [a-z]/g, function (s) {
		return s.replace(' ', '').toUpperCase();
	});
	
	note.prototype[name] = function () {
		return this.plus(itv.fromName(e));
	};
	
	note.prototype[name + 'Of'] = function () {
		return this.minus(itv.fromName(e));
	};
});

/**
 * 
 */
module.exports.toArray = function () {
//quick array copy
	return notes.concat([]);
};