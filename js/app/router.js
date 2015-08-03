var Backbone  = require('backbone');
var SetupView = require('./views/setup/main');
var GameView  = require('./views/game/main');
var LogView   = require('./views/stats/main');

var levels = {
	"beginner"    : ['third', 'minor third', 'fifth', 'octave'],
	"easy"        : ['fourth', 'minor sixth', 'sixth', 'minor seventh', 'seventh'],
	"intermediate": ['minor second', 'second', 'triton', 'minor seventh', 'seventh'],
	"expert"      : ['minor second', 'second', 'minor third', 'third', 'fourth', 
					'triton', 'fifth', 'minor sixth', 'sixth', 'minor seventh', 'seventh']
};

module.exports = Backbone.Router.extend({
	routes:{
		''                         : 'index',
		'!/way/:w/octave/:o/tr/:t' : 'start', 
		'*notFound'                : 'notFound'
	},
	
	closeMainView: function () {
		if (app.mainView) {
			app.state.off(null, null, app.mainView);
			app.mainView.remove();
		}
	},
	
	closeLogView: function () {
		if (app.logView) {
			app.state.off(null, null, app.logView);
			app.logView.remove();
		}
	},
	
	initStateGame: function (w, o, t) {
		console.log(w, o, t);
		app.state.set('root-note', 'random');
		
		app.state.set('octave-from', 2);
		app.state.set('motion', w === "d" ? "d" : "u");
		app.state.set('octave-range', parseInt(o) > 3 ? 3 : parseInt(o));
		app.state.set('allowed-intervals', levels[t] || levels['beginner']);
		app.state.trigger('clicked:start');
	},
	
	index: function () {
		this.closeMainView();
		this.closeLogView();
		app.mainView = new SetupView();
		$('#control').html(app.mainView.render().$el);
	},
	
	start: function (w, o, t) {
		this.closeLogView();
		this.closeMainView();
		this.initStateGame(w, o, t);
		
		app.mainView = new GameView();
		app.logView = new LogView();
		$('#control').html(app.mainView.render().$el);
		$('#game-logs').html(app.logView.render().$el);
		
		app.mainView.chooseIntervals();
	},
	
	notFound: function () {
		alert('not found');
		this.navigate('/', {trigger: true});
	}
});
