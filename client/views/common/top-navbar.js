import { Session } from 'meteor/session'

Template.topNavbar.events({
  'input #search-field': function (event, templateInstance) {
    Session.set('searchValue', event.currentTarget.value);
  },
  'click .btn-logout': function (event, templateInstance) {
    Meteor.logout();
  }
});

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


