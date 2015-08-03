

var intervals = [
	'unisson',
	'minor second',
	'second',
	'minor third',
	'third',
	'fourth',
	'triton',
	'fifth',
	'minor sixth',
	'sixth',
	'minor seventh',
	'seventh'
];

var octaveIntervals = [
	'octave',
	'minor ninth',
	'ninth',
	'minor third',
	'third',
	'eleventh',
	'triton',
	'fifth',
	'minor thirteenth',
	'thirteenth',
	'minor seventh',
	'seventh'	
];

var quality = {
	perfect    : [5, 7],
	diminished : [4, 6],
	augmented  : [6, 8],
	major      : [2, 4, 9, 11],
	minor      : [1, 3, 8, 10]
};

/**
 * 
 */
var Interval = function (semitones) {
	var octave = Math.abs(Math.floor(semitones / 12));
	var semitones = (semitones % 12 + 12) % 12 + octave * 12;
	
	this.semitones = function () {
		return semitones;
	};
	
	this.octave = function () {
		return octave;
	};
};

/**
 * 
 */
Interval.prototype.innerOctaveInterval = function () {
	return new Interval(this.semitones() % 12);
};

/**
 * 
 */
Interval.prototype.name = function () {
	var inter = this.semitones() >= 12 ? octaveIntervals : intervals;
	return inter[this.innerOctaveInterval().semitones()];
	
};

/**
 * 
 */
Interval.prototype.valueOf = function () {
	return this.semitones();
};

/**
 * 
 */
Interval.prototype.is = function (type) {
	return (quality[type] || []).indexOf(type) !== -1;
};

/**
 * 
 */
Interval.prototype.plus = function (semitones) {
	return new Interval(this.semitones() + semitones.valueOf());
};

/**
 * 
 */
Interval.prototype.minus = function (semitones) {
	return new Interval(this.semitones() - semitones.valueOf());
};

/**
 * 
 */
Interval.prototype.opposite = function () {
	var q = this.innerOctaveInterval().semitones();
	return new Interval(12 - q + this.octave());
};

module.exports = {
	
	/**
	 * Return an interval object from semitones
	 * 
	 * @return {Object}
	 */
	fromSemitones : function (semitones) {
		return new Interval(semitones);
	},
	
	/**
	 * Get a copy of intervals
	 * 
	 * @returns array
	 */
	toArray : function (includeOctave) {
		return includeOctave ? 
			 intervals.concat(octaveIntervals) :
			 intervals.concat([]);
	},
	
	/**
	 * Return an interval from a name
	 * 
	 * @param name a semitones name
	 * @returns {Object}
	 */
	fromName : function (name) {
		if (intervals.indexOf(name) !== -1) {
			return module.exports.fromSemitones(intervals.indexOf(name));
		}
		
		if (octaveIntervals.indexOf(name) !== -1) {
			return module.exports.fromSemitones(octaveIntervals.indexOf(name) + 12);
		}
		
		throw Error('Unknown interval');
	}
};
