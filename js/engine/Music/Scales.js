/**
 * 
 */
(function (x) {
	
	var scales = {
    	"pentatonic": [2, 2, 3, 2, 3],
    	"diatonic"  : [2, 2, 1, 2, 2, 2, 1],
    	"chromatic" : [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    };
	
	var modes = [
        'ionian',
        'hyper ionian',
        'dorian',
        'phrygian',
        'hyper phrygian',
        'lydian',
        'hyper lydian',
        'mixolydian',
        'hyper mixolydian',
        'aeolian',
        'hyper aeolian',
        'locrian'
    ];
	
	var Scale = function (scale) {
		this.scale = scale;
	};
	
	/**
	 * Transform the scale intervals into cumulated intervals
	 * 
	 * @returns {Array}
	 */
	Scale.prototype.getIntervalsFromTonic = function () {
		var acc   = 0;
		var cumul = [0];
		
		_.each(this.scale, function (i) {
			acc += i;
			cumul.push(acc);
		});
		
		return cumul;
	};
	
	Scale.prototype.toBits = function () {
		var bin = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		
		_.each(this.getIntervalsFromTonic(), function (i) {
			bin.splice(i, 1, 1);
		});
		return bin;
	};
	
	
})(window);