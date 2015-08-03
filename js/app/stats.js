var Klass = require('../engine/Class');

module.exports = new Klass({
	
	initialize: function () {
		this.stats = {};	
	},
	
	set: function (expected, answer) {
		if (!this.stats[expected]) {
			this.stats[expected] = {};
		}
		
		if (!this.stats[expected][answer]) {
			this.stats[expected][answer] = 0;
		}
		
		this.stats[expected][answer]++;
		return this;
	},
	
	getGlobal: function (expected) {
		return this.getSpecific(expected, expected);
	},
	
	getSpecific: function (expected, anwser) {
		var result = {hits: 0, tries: 0};
		
		if (!this.stats[expected]) {
			return result;	
		}
		
		_.each(_.keys(this.stats[expected]), _.bind(function (k) {
			result.tries += this.stats[expected][k];
			if (k === anwser) {
				result.hits = this.stats[expected][answer];
			}
		}, this));
		return result;
	},
	
	sumUp: function (expected) {
		var result = {
			interval: expected, 
			intervalId: expected.replace(' ', '-'),
			correct: 0, 
			tries: 0, 
			average: 0, 
			errors: [],
			errorsIndexed:{},
			totalErrors: 0
		};
		
		if (!this.stats[expected]) {
			return result;	
		}
		
		_.each(_.keys(this.stats[expected]), _.bind(function (k) {
			result.tries += this.stats[expected][k];
			if (k === expected) {
				result.correct = this.stats[expected][expected];
			} else {
				result.totalErrors += this.stats[expected][k];
				var e = {
					interval: k,
					intervalId: k.replace(' ', '-'),
					hits: this.stats[expected][k]
				};
				result.errorsIndexed[k] = e;
				result.errors.push(e);
			}
		}, this));
		
		if (result.tries > 0) {
			result.average = Math.floor((result.correct / result.tries) * 100);
		}
		_.each(result.errors, _.bind(function (e) {
			e.average = Math.floor((e.hits / result.tries) * 100);
			e.averageError = Math.floor((e.hits / result.totalErrors) * 100);
		}, this))
		return result;
	}
	
});
