var Backbone = require('backbone');
var template = require('./tpl/game.hbs');

module.exports = Backbone.View.extend({
	started: false,
	tpl: template({}),
	className: "game control-box",
	
	events: {
		'click span.play': 'startGame',
		'click span.reset': 'stopGame',
		'click .intervals span': 'intervalClicked'
		
	},
	
	initialize: function (opt) {  
		app.state.on('change:tries', _.bind(this.onChangeScore, this), this);  
		app.state.on('answer:wrong', _.bind(this.onWrongAnswer, this), this);  
		app.state.on('answer:right', _.bind(this.onCorrectAnswer, this), this);
		
	},
	
	intervalClicked: function (e, data) { 
		if (!this.started) {
			return;
		}
		
		if ($(e.target).hasClass('disabled')) {
			return;
		}
		
		app.state.trigger('clicked:interval', {
			interval: this.intervalNameFromElem(e.target)
		});
	},
	
	/**
	 *
	 */
	onCorrectAnswer: function () {
		this.$el.find('#intervals-errors').empty();
		this.$el.find('span.play')
			.removeClass('btn-primary')
			.addClass('btn-success')
			.text('next interval');
			
		this.$el.find('.score').css({color:'#7EC97A'});
		this.$el.find('.intervals span.btn').addClass('disabled');
		this.started = false;
		return;
		
		_.each(this.options.state.get('errors'), _.bind(function (e, name) {				
			this.$el.find('#intervals-errors')
				.append('<li>' + name+' not found ' + e['global'] + ' time(s)</li>');
		}, this));
	},

	/**
	 *
	 */
	onWrongAnswer: function (data) {						
		this.$el.find('span.score').css({color:'#D88'});
		var elem = this.$el.find('#intervals-'+data.answer.replace(' ', '-'));
		elem.addClass('shake animated')
			.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
				elem.removeClass('shake animated');
			});
	},
	
	onChangeScore: function () {
		var score = app.state.get('score') || 0;
		var tries = app.state.get('tries') || 0;			

		if (tries === 0) {
			this.$el.find('#intervals-errors').empty();
			this.$el.find('span.score').empty();
			return;
		}

		this.$el.find('span.score').html(
			'score: ' + score + ' / ' + tries
		);
	},


	
	startGame: function () {
		if (!this.started) {
			this.started = true;
			this.chooseIntervals();	
		}
		
		app.state.trigger('clicked:play');
		this.$el.find('span.play')
			.removeClass('btn-success')
			.addClass('btn-primary')
			.text('play interval');
	},
	
	intervalNameFromElem: function (elem) {
		return $(elem).closest('.intervals').attr('id')
			.replace('intervals-', '')
			.replace('-', ' ');
	},
	
	chooseIntervals: function () {
		this.$el.find('.intervals span.btn').addClass('disabled');
		var itvs = app.state.get('allowed-intervals');
		
		if (!this.started) {
			return;
		}
		
		_.each(itvs, function (itv) {
			$('#intervals-' + itv.replace(' ', '-') + ' span.btn').removeClass('disabled');
		});
		
		return this;
	},
	
	render: function () {
		this.$el.html(this.tpl);
		return this;
	},
	
	stopGame: function () {
		app.state.trigger('clicked:stop');
		app.router.navigate('/', {trigger: true});
		return false;
	}
});
