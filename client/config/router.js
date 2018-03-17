
Router.onBeforeAction(function() {
  if (! Meteor.userId()) {
    this.render('login');
  } else {
    this.next();
  }
});


Router.route('/', function() {
	this.wait(Meteor.subscribe('handles'));
	this.wait(Meteor.subscribe('logs'));
  this.wait(Meteor.subscribe('tickets'));
  this.wait(Meteor.subscribe('userData'));
  this.render("main");
});

Router.route('/login',
	function() {
        this.render("login");
});