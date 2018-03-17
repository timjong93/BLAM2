Template.topNavbar.rendered = function(){

    // FIXED TOP NAVBAR OPTION
    // Uncomment this if you want to have fixed top navbar
    // $('body').addClass('fixed-nav');
    // $(".navbar-static-top").removeClass('navbar-static-top').addClass('navbar-fixed-top');

};

Template.topNavbar.helpers({
    username: function() {
        return Meteor.user().username;
      },
    function: function() {
        return Meteor.user().profile.function;
      },
    currentTime: function() {
        return Chronos.moment().format('HH:mm:ss');
    }
});

Template.topNavbar.events({

  'click .btn-fullscreen': function (event, template) {
    if (BigScreen.enabled) {
        BigScreen.toggle();
    }
  },
  'click .btn-logout': function (event, template) {
    if (BigScreen.enabled) {
        Meteor.logout();
    }
  },

});
