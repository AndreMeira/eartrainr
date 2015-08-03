var Backbone  = require('backbone');
var Stats     = require('../../stats');
var line      = require('./tpl/line.hbs');


module.exports = Backbone.View.extend({
	
	className: "game-logs",
	
	initialize: function (opt) {
		this.wrong = false;
		this.statsHistory = {};  
		this.stats = new Stats();
		app.state.on('answer:wrong', _.bind(this.onWrongAnswer, this), this);  
		app.state.on('answer:right', _.bind(this.onCorrectAnswer, this), this);
	},
	
	onCorrectAnswer: function (data) {
		if (!this.wrong) {
			this.stats.set(data.expected, data.answer);	
		}
		this.wrong = false;
		var newResult = this.mergeResult(data.expected);
		this.statsHistory[data.expected] = newResult;
		
		this.$el.closest('#game-logs').scrollTop(0);
		this.$el.find('#log-line-'+newResult.intervalId).remove();
		this.$el.prepend(line(newResult));
		var elem = this.$el.find('#log-line-'+newResult.intervalId);
		
		_.delay(_.bind(function () {
			this.recomputeWidth(newResult, elem);
		},this), 200);
		
		return;
	},
	
	recomputeWidth: function (result, elem) {
		elem.find('.'+result.intervalId+' .log-graph').animate({
			width: result.average + '%'
		}, 300);
		
		_.each(result.errors, function (e) {
			elem.find('.'+e.intervalId+' .log-graph').animate({
				width: e.average + '%'
			}, 300);
		});
	},
	
	mergeResult: function (expected) {
		var result = this.stats.sumUp(expected);
		result.oldAverage = this.statsHistory[expected] 
			? this.statsHistory[expected].average 
			: result.average;
		
		_.each(result.errors, _.bind(function (e) {
			e.oldAverage = 0;
			
			if (!this.statsHistory[expected]) {
				e.oldAverage = e.average;
			}
			
			if (this.statsHistory[expected]
			&& this.statsHistory[expected]["errorsIndexed"][e.interval]) {
				e.oldAverage = this.statsHistory[expected]["errorsIndexed"][e.interval].average;
			}
		}, this)); 
		return result;
		
		//to be developped.
	},
	
	onWrongAnswer: function (data) {
		this.wrong = true;
		this.stats.set(data.expected, data.answer);
	},
	
	render: function () {
		this.$el.html(this.tpl);
		return this;
	}
});
