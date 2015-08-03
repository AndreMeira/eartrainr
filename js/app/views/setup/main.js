var Backbone = require('backbone');
var template = require('./tpl/setup.hbs');

module.exports = Backbone.View.extend({
	tpl: template({}),
	className: "setup control-box",
	
	events: {
		'click button': 'startGame'
	},
	
	initialize: function (opt) {
		
	},
	
	render: function () {
		this.$el.html(this.tpl);
		return this;
	},
	
	startGame: function () {
		var route = '';
		route += '!/way/'+ this.$el.find('input[type="radio"]:checked').val();
		route += '/octave/'+this.$el.find('select#rng-select').val();
		route += '/tr/'+this.$el.find('select#itv-select').val();
		app.router.navigate(route, {trigger: true});
		return false;
	}
});
