window.$ = require('jquery');
window._ = require('underscore');
window.app   = require('./app');
var Backbone = require('backbone');
var Engine   = require('./engine');
var Router   = require('./app/router');
var State    = require('./app/state');

app.router = new Router();
app.state  = new State();
app.engine = new Engine(app.state);

Backbone.history.start({
	//pushState:true,
	root:'/eartrainr/'
});
